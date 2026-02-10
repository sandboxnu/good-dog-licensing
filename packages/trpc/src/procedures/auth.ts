import { TRPCError } from "@trpc/server";

import type { UserWithSession } from "../types";
import { authenticatedAndActiveProcedureBuilder } from "../middleware/authenticated-active";
import { notAuthenticatedProcedureBuilder } from "../middleware/not-authenticated";
import { zSignInValues } from "../schema";
import { authenticatedOnlyProcedureBuilder } from "../middleware/authenticated-only";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const signInProcedure = notAuthenticatedProcedureBuilder
  .input(zSignInValues)
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

export const signOutProcedure = authenticatedOnlyProcedureBuilder.mutation(
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

export const deleteAccountProcedure =
  authenticatedAndActiveProcedureBuilder.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        userId: ctx.session.user.userId,
      },
    });

    ctx.cookiesService.deleteSessionCookie();

    return {
      message: "Successfully deleted account",
    };
  });

export const refreshSessionProcedure =
  authenticatedAndActiveProcedureBuilder.mutation(async ({ ctx }) => {
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
            affiliation: true,
            ipi: true,
            createdAt: true,
            active: true,
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
  });
