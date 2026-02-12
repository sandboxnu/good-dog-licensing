import { TRPCError } from "@trpc/server";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";
import { notAuthenticatedProcedureBuilder } from "../middleware/not-authenticated";
import { zSignInValues } from "../schema";

const getNewSessionExpirationDate = (rememberMe: boolean) =>
  rememberMe
    ? new Date(Date.now() + 60_000 * 60 * 24 * 30)
    : new Date(Date.now() + 60_000 * 60 * 12);

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
      // Failed login attempt, don't reveal if user exists
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
        expiresAt: getNewSessionExpirationDate(input.rememberMe),
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
        userId: ctx.session.user.userId,
      },
    });

    ctx.cookiesService.deleteSessionCookie();

    return {
      message: "Successfully deleted account",
    };
  },
);
