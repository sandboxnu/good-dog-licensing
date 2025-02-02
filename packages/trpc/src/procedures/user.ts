import { baseProcedureBuilder } from "../internal/init";
import { authenticatedProcedureBuilder } from "../middleware/authentictated";

export const getAuthenticatedUserProcedure =
  authenticatedProcedureBuilder.query(({ ctx }) => {
    return ctx.session.user;
  });

export const getUserProcedure = baseProcedureBuilder.query(async ({ ctx }) => {
  const sessionId = ctx.cookiesService.getSessionCookie();

  if (!sessionId?.value) {
    return null;
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
          phoneNumber: true,
          role: true,
        },
      },
    },
  });

  if (!sessionOrNull || sessionOrNull.expiresAt < new Date()) {
    // Session expired or not found
    return null;
  }

  return sessionOrNull.user;
});
