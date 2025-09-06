import React from "react";

import type { prisma } from "@good-dog/db";

/**
 * This function is important because we request the session from the database
 * in a few places in our codebase. This function is memoized so that we don't
 * make multiple requests to the database for the same request
 *
 * For example, the authenticated-procedure middleware, the get-user procedure,
 * and the not-authenticated-procedure middleware all use this function and in theory
 * could all be called in the same request.
 */
export const getSessionMemoized = React.cache(
  async (_prisma: typeof prisma, sessionId: string) => {
    try {
      return await _prisma.session.findUnique({
        where: {
          sessionId: sessionId,
        },
        select: {
          expiresAt: true,
          sessionId: true,
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
    } catch {
      // TODO: handle this error properly, but we don't want the site to
      // crash if sessions are not available
      return null;
    }
  },
);
