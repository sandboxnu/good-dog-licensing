import { TRPCError } from "@trpc/server";

import { baseProcedureBuilder } from "../internal/init";
import { getSessionMemoized } from "../internal/prisma-abstraction";

export const authenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = ctx.cookiesService.getSessionCookie();

    if (!sessionId?.value) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const sessionOrNull = await getSessionMemoized(ctx.prisma, sessionId.value);

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
