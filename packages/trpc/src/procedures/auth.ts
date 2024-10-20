import { z } from "zod";

import { comparePassword, hashPassword } from "@good-dog/auth";

import { baseProcedureBuilder } from "../internal/init";

// TODO: refactor to use cookies
export const signUpProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const existingUser = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new Error(`User already exists for ${input.email}`);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        expiresAt: new Date(),
      },
    });

    return {
      message: `Successfully signed up and logged in as ${input.email}`,
      sessionId: session.id,
    };
  });

// TODO: refactor to use cookies
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

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const match = await comparePassword(input.password, user.password);

    if (!match) {
      throw new Error("Invalid credentials");
    }

    const date = new Date();
    date.setDate(date.getDate() + 30);

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        expiresAt: date,
      },
    });

    return {
      message: `Successfully logged in as ${input.email}`,
      sessionId: session.id,
    };
  });

// TODO: refactor to use cookies
export const signOutProcedure = baseProcedureBuilder
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.session.delete({
      where: {
        id: input.id,
      },
    });

    return {
      message: "Successfully logged out",
    };
  });

// TODO: refactor to use cookies
export const deleteAccountIfExistsProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new Error(`No user found for ${input.email}`);
    }

    await ctx.prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await ctx.prisma.user.delete({
      where: {
        email: input.email,
      },
    });

    return {
      message: "Successfully deleted account",
    };
  });
