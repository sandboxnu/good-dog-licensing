import React from "react";
import { cookies } from "next/headers";

import {
  deleteSessionCookieBuilder,
  getSessionCookieBuilder,
  setSessionCookieBuilder,
} from "@good-dog/auth/cookies";
import { passwordService } from "@good-dog/auth/password";
import { prisma } from "@good-dog/db";
import { emailService } from "@good-dog/email";

/**
 * @see: https://trpc.io/docs/server/context
 */
export const createTRPCContext = React.cache(async () => {
  const awaitedCookies = await cookies();

  return {
    prisma: prisma,
    passwordService: passwordService,
    cookiesService: {
      getSessionCookie: getSessionCookieBuilder(awaitedCookies),
      setSessionCookie: setSessionCookieBuilder(awaitedCookies),
      deleteSessionCookie: deleteSessionCookieBuilder(awaitedCookies),
    },
    emailService: emailService,
  };
});
