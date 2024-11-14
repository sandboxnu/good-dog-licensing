import { getSessionCookie } from "@good-dog/auth/cookies";

import {
  authenticatedProcedureBuilder,
  baseProcedureBuilder,
} from "../internal/init";

export const getAuthenticatedUserProcedure =
  authenticatedProcedureBuilder.query(({ ctx }) => {
    return ctx.session.user;
  });

export const getUserProcedure = baseProcedureBuilder.query(async ({ ctx }) => {
  const sessionId = getSessionCookie();

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
