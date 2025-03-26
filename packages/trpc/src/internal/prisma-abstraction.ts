import React from "react";

import type { prisma } from "@good-dog/db";

/**
 * This funciton is important because we request the session from the database
 * in a few places in our codebase. This function is memoized so that we don't
 * make multiple requests to the database for the requested.
 *
 * For example, the authenticated-procedure middleware, the get-user procedure,
 * and the not-authenticated-procedure middleware all use this function and in theory
 * could all be called in the same request.
 */
export const getSessionMemoized = React.cache(
  async (_prisma: typeof prisma, sessionId: string) => {
    return await _prisma.session.findUnique({
      where: {
        sessionId: sessionId,
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
  },
);
