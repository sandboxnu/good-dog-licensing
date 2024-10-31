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

const getNewEmailVerificationCodeExpirationDate = () =>
  new Date(Date.now() + 60_000 * 15);

export const sendEmailVerificationProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Generate 6 digit code for email verification
    let emailCode = "";
    for (let i = 0; i < 6; i++) {
      emailCode += Math.floor(Math.random() * 10);
    }

    // Send email. If sending fails, throw error.
    if (!(await sendEmailVerification(input.email, emailCode))) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Email confirmation to ${input.email} failed to send.`,
      });
    }

    // Create the email verification code in the database
    await ctx.prisma.emailVerificationCode.create({
      data: {
        code: emailCode,
        email: input.email,
        expiresAt: getNewEmailVerificationCodeExpirationDate(),
      },
    });

    return {
      message: `Email verification code sent to ${input.email}`,
    };
  });

export const confirmEmailProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      code: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Get email verification from database
    const emailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      });

    // If email verification not found, throw error
    if (emailVerificationCode == null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `${input.email} is not waiting to be confirmed.`,
      });
    }

    // TODO: Check email verification code is not expired.

    // If given code is wrong, throw error
    if (input.code != emailVerificationCode.code) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Given code is incorrect for ${input.email}`,
      });
    }

    // If here, the given code was correct, so we can delete the emailVerificationCode.
    await ctx.prisma.emailVerificationCode.update({
      where: {
        email: input.email,
      },
      data: {
        emailConfirmed: true,
      },
    });

    return {
      message: `Email was successfully verified. Email: ${ctx.session.user.email}.`,
    };
  });

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
