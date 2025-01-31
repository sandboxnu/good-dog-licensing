import { TRPCError } from "@trpc/server";

import { baseProcedureBuilder } from "../internal/init";

export const authenticatedProcedureBuilder = baseProcedureBuilder.use(
  async ({ ctx, next }) => {
    const sessionId = ctx.cookiesService.getSessionCookie();

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
