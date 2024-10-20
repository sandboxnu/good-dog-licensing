import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { comparePassword, hashPassword } from "@good-dog/auth";
import { deleteSessionCookie, setSessionCookie } from "@good-dog/auth/cookies";

import { baseProcedureBuilder } from "../internal/init";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

// TODO: ensure already authenticated users can't sign up
export const signUpProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const existingUserWithEmail = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUserWithEmail) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.email}`,
      });
    }

    const hashedPassword = await hashPassword(input.password);

    const userWithSesion = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        sessions: {
          create: {
            expiresAt: getNewSessionExpirationDate(),
          },
        },
      },
      select: {
        sessions: true,
      },
    });

    const session = userWithSesion.sessions[0];

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create session",
      });
    }

    setSessionCookie(session.id, session.expiresAt);

    return {
      message: `Successfully signed up and logged in as ${input.email}`,
    };
  });

// TODO: ensure already authenticated users can't sign in
export const signInProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    const error = () =>
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });

    if (!user) {
      // Failed loggin attempt, don't reveal if user exists
      throw error();
    }

    const match = await comparePassword(input.password, user.password);

    if (!match) {
      throw error();
    }

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        expiresAt: getNewSessionExpirationDate(),
      },
    });

    setSessionCookie(session.id, session.expiresAt);

    return {
      message: `Successfully logged in as ${input.email}`,
    };
  });

// TODO: refactor to use middleware
export const signOutProcedure = baseProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.session.delete({
      where: {
        id: ctx.session.id,
      },
    });

    deleteSessionCookie();

    return {
      message: "Successfully logged out",
    };
  },
);

// TODO: refactor to use middleware
export const deleteAccountProcedure = baseProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.userId,
      },
    });

    deleteSessionCookie();

    return {
      message: "Successfully deleted account",
    };
  },
);
