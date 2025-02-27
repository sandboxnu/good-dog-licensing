import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { UserWithSession } from "../internal/common-types";
import { authenticatedProcedureBuilder } from "../middleware/authenticated";
import { notAuthenticatedProcedureBuilder } from "../middleware/not-authenticated";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const signUpProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phoneNumber: z
        .string()
        .regex(
          /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
          "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
        ),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const [emailVerificationCode, existingUserWithEmail] = await Promise.all([
      ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      }),
      ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      }),
    ]);

    // Throw error if email is not verified
    if (!emailVerificationCode?.emailConfirmed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Email has not been verified.",
      });
    }

    if (existingUserWithEmail) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.email}`,
      });
    }

    const hashedPassword = await ctx.passwordService.hashPassword(
      input.password,
    );

    const [userWithSession] = await ctx.prisma.$transaction([
      ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          role: "ONBOARDING",
          email: input.email,
          phoneNumber: input.phoneNumber,
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
      }),
      ctx.prisma.emailVerificationCode.delete({
        where: {
          email: input.email,
        },
      }),
    ]);

    const session = userWithSession.sessions[0];

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create session",
      });
    }

    ctx.cookiesService.setSessionCookie(session.sessionId, session.expiresAt);

    return {
      message: `Successfully signed up and logged in as ${input.email}.`,
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

    const match = await ctx.passwordService.comparePassword(
      input.password,
      user.hashedPassword,
    );

    if (!match) {
      throw error();
    }

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          },
        },
        expiresAt: getNewSessionExpirationDate(),
      },
    });

    ctx.cookiesService.setSessionCookie(session.sessionId, session.expiresAt);

    return {
      message: `Successfully logged in as ${input.email}`,
    };
  });

export const signOutProcedure = authenticatedProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.session.delete({
      where: {
        sessionId: ctx.session.sessionId,
      },
    });

    ctx.cookiesService.deleteSessionCookie();

    return {
      message: "Successfully logged out",
    };
  },
);

export const deleteAccountProcedure = authenticatedProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        userId: ctx.session.userId,
      },
    });

    ctx.cookiesService.deleteSessionCookie();

    return {
      message: "Successfully deleted account",
    };
  },
);

export const refreshSessionProcedure = authenticatedProcedureBuilder.mutation(
  async ({ ctx }) => {
    const sessionId = ctx.session.sessionId;

    const updatedSession = await ctx.prisma.session.update({
      where: {
        sessionId: sessionId,
      },
      data: {
        expiresAt: getNewSessionExpirationDate(),
      },
      select: {
        sessionId: true,
        expiresAt: true,
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    ctx.cookiesService.setSessionCookie(
      updatedSession.sessionId,
      updatedSession.expiresAt,
    );

    const user: UserWithSession = {
      ...updatedSession.user,
      session: {
        expiresAt: updatedSession.expiresAt,
        refreshRequired: false,
      },
    };

    return {
      message: "Session refreshed",
      user,
    };
  },
);
