import { TRPCError } from "@trpc/server";

import { baseProcedureBuilder } from "../internal/init";

// This middleware is used to prevent authenticated users from accessing a resource
export const notAuthenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = ctx.cookiesService.getSessionCookie();

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
