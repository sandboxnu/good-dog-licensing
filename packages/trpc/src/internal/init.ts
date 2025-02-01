import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { ZodError } from "zod";

import { env } from "@good-dog/env";

import type { createTRPCContext } from "./context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
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
        sessionId: sessionId.value,
      },
      include: {
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
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

export const adminAuthenticatedProcedureBuilder =
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx });
  });

  export const adminOrModeratorAuthenticatedProcedureBuilder =
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (ctx.session.user.role !== "MODERATOR" && ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx });
  });

// This middleware is used to prevent authenticated users from accessing a resource
export const notAuthenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = getSessionCookie();

    if (!sessionId?.value) {
      return next({ ctx });
    }

    const sessionOrNull = await ctx.prisma.session.findUnique({
      where: {
        sessionId: sessionId.value,
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
