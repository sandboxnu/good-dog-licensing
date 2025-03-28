import type { UserWithSession } from "../internal/common-types";
import { baseProcedureBuilder } from "../internal/init";
import { authenticatedProcedureBuilder } from "../middleware/authenticated";

export const getAuthenticatedUserProcedure =
  authenticatedProcedureBuilder.query(({ ctx }) => {
    const result: UserWithSession = {
      ...ctx.session.user,
      session: {
        expiresAt: ctx.session.expiresAt,
        refreshRequired:
          // Refresh session if it expires in less than 29 days
          ctx.session.expiresAt.getTime() - Date.now() < 60_000 * 60 * 24 * 29,
      },
    };

    return result;
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
    select: {
      expiresAt: true,
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

  const result: UserWithSession = {
    ...sessionOrNull.user,
    session: {
      expiresAt: sessionOrNull.expiresAt,
      refreshRequired:
        // Refresh session if it expires in less than 29 days
        sessionOrNull.expiresAt.getTime() - Date.now() < 60_000 * 60 * 24 * 29,
    },
  };

  return result;
});
