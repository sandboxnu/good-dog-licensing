import React from "react";
import { cookies } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

import { prisma } from "@good-dog/db";

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
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Procedure builders
export const baseProcedureBuilder = t.procedure;
export const authenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionToken = cookies().get("sessionToken");

    if (!sessionToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const sessionOrNull = await ctx.prisma.session.findUnique({
      where: {
        id: parseInt(sessionToken.value),
      },
      include: {
        user: true,
      },
    });

    if (!sessionOrNull || sessionOrNull.expiresAt < new Date()) {
      // Session expired or not found
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user: sessionOrNull.user,
      },
    });
  },
);
