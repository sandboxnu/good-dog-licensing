import { TRPCError } from "@trpc/server";

import { notAuthenticatedProcedureBuilder } from "../middleware/not-authenticated";
import { zSignInValues } from "../schema";
import { authenticatedOnlyProcedureBuilder } from "../middleware/authenticated-only";
import { authenticatedAndActiveProcedureBuilder } from "../middleware/authenticated-active";

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

    console.log("Found user: ", user?.email);
    console.log("Hashed password from DB: ", user?.hashedPassword);
    console.log("Got here");

    const error = () =>
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });

    console.log("Got here too");

    if (!user) {
      console.log("User not found for email: ", input.email);
      // Failed login attempt, don't reveal if user exists
      throw error();
    }

    console.log("Made it here");

    const match = await ctx.passwordService.comparePassword(
      input.password,
      user.hashedPassword,
    );

    console.log("Password match: ", match);

    if (!match) {
      console.log("Password mismatch for email: ", input.email);
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

    console.log(
      "Created session: ",
      session.sessionId,
      " for user: ",
      user.email,
    );

    ctx.cookiesService.setSessionCookie(session.sessionId, session.expiresAt);

    console.log("Set session cookie for session: ", session.sessionId);

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

export const deactivateSelfProcedure =
  authenticatedAndActiveProcedureBuilder.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: {
        userId: ctx.session.user.userId,
      },
      data: {
        active: false,
      },
    });

    return {
      message: "Successfully deactivated account",
    };
  });
