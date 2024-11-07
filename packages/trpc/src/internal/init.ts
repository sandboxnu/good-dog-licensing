import React from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

import { getSessionCookie } from "@good-dog/auth/cookies";
import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";

export const createTRPCContext = React.cache(() => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {
    prisma: prisma,
  };
});

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<ReturnType<typeof createTRPCContext>>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.code === "BAD_REQUEST" && error.cause instanceof ZodError
          ? error.cause.flatten()
          : null,
      prismaError:
        env.VERCEL_ENV !== "production" &&
        error.code === "INTERNAL_SERVER_ERROR" &&
        error.cause &&
        "clientVersion" in error.cause
          ? error.cause
          : null,
    },
  }),
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Procedure builders
export const baseProcedureBuilder = t.procedure;
export const authenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = getSessionCookie();

    if (!sessionId?.value) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const sessionOrNull = await ctx.prisma.session.findUnique({
      where: {
        id: sessionId.value,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            sessions: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!sessionOrNull || sessionOrNull.expiresAt < new Date()) {
      // Session expired or not found
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        session: sessionOrNull,
      },
    });
  },
);

// This middleware is used to prevent authenticated users from accessing a resource
export const notAuthenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = getSessionCookie();

    if (!sessionId?.value) {
      return next({ ctx });
    }

    const sessionOrNull = await ctx.prisma.session.findUnique({
      where: {
        id: sessionId.value,
      },
    });

    if (sessionOrNull && sessionOrNull.expiresAt > new Date()) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx,
    });
  },
);
