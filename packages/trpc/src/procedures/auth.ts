import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { deleteSessionCookie, setSessionCookie } from "@good-dog/auth/cookies";
import { comparePassword, hashPassword } from "@good-dog/auth/password";
import { sendEmailVerification } from "@good-dog/email";

import {
  authenticatedProcedureBuilder,
  notAuthenticatedProcedureBuilder,
} from "../internal/init";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const signUpProcedure = notAuthenticatedProcedureBuilder
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

    // DO WE WANT THE USER TO BE CREATED IF THE EMAIL FAILS? OR FAIL BEFORE USER IS CREATED?

    // Generate 6 digit code for email verification
    let emailCode = "";
    for (let i = 0; i < 6; i++) {
      emailCode += Math.floor(Math.random() * 10);
    }

    if (!(await sendEmailVerification(input.email, emailCode))) {
      // Email failed to send
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Email confirmation to ${input.email} failed to send.`,
      });
    }

    const hashedPassword = await hashPassword(input.password);

    const userWithSession = await ctx.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        hashedPassword: hashedPassword,
        sessions: {
          create: {
            expiresAt: getNewSessionExpirationDate(),
          },
        },
        emailVerificationCode: {
          create: {
            code: emailCode,
          },
        },
      },
      select: {
        sessions: true,
      },
    });

    const session = userWithSession.sessions[0];

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create session",
      });
    }

    setSessionCookie(session.id, session.expiresAt);

    return {
      message: `Successfully signed up as ${input.email}. User's email must still be verified.`,
    };
  });

export const confirmEmailProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Need to first check if there is an emailVerificationCode, if not throw error?
    if (ctx.session.user.emailVerificationCode == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "User does not have an assiocated email verification code or the user has already verifed email.",
      });
    }

    const expectedCode = ctx.session.user.emailVerificationCode.code;
    if (expectedCode != input.code) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "User does not have an assiocated email verification code or the user has already verifed email.",
      });
    }

    // If here, the given code was correct, so we can delete the emailVerificationCode.
    await ctx.prisma.emailVerificationCode.delete({
      where: {
        userId: ctx.session.userId,
      },
    });

    return {
      message: `Email was successfully verified. Email: ${ctx.session.user.email}.`,
    };
  });

export const signInProcedure = notAuthenticatedProcedureBuilder
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

    const match = await comparePassword(input.password, user.hashedPassword);

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

export const signOutProcedure = authenticatedProcedureBuilder.mutation(
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

export const deleteAccountProcedure = authenticatedProcedureBuilder.mutation(
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
