import React from "react";
import { TRPCError } from "@trpc/server";

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
const SESSION_LOOKUP_RETRY_DELAY_MS = 250;

const findSession = (_prisma: typeof prisma, sessionId: string) =>
  _prisma.session.findUnique({
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
          affiliation: true,
          otherAffiliationName: true,
          ipi: true,
          publisher: true,
          publisherIpi: true,
          createdAt: true,
          active: true,
        },
      },
    },
  });

/**
 * Returns the session, or null if it doesn't exist.
 *
 * A database error is NOT treated as "no session": that used to make a
 * temporary database problem (e.g. the connection pooler being full) look
 * like the user had been logged out. Instead the lookup is retried once
 * after a short pause, and if it still fails an error is thrown, so the page
 * shows the error screen ("Try again") and the user stays logged in.
 */
export const getSessionMemoized = React.cache(
  async (_prisma: typeof prisma, sessionId: string) => {
    try {
      return await findSession(_prisma, sessionId);
    } catch (firstError) {
      console.warn("[auth] Session lookup failed; retrying once", firstError);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, SESSION_LOOKUP_RETRY_DELAY_MS),
    );

    try {
      return await findSession(_prisma, sessionId);
    } catch (error) {
      console.error("[auth] Session lookup failed after retry", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not verify your session. Please try again.",
        cause: error,
      });
    }
  },
);
