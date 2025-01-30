import {
  deleteSessionCookieBuilder,
  getSessionCookieBuilder,
  setSessionCookieBuilder,
} from "@good-dog/auth/cookies";

import type { MockNextCookies } from "./MockNextCookies";

export const createMockCookieService = (cookies: MockNextCookies) => {
  return {
    getSessionCookie: getSessionCookieBuilder(cookies),
    setSessionCookie: setSessionCookieBuilder(cookies),
    deleteSessionCookie: deleteSessionCookieBuilder(cookies),
  };
};
