import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const SESSION_COOKIE_NAME = "sessionId";

export const getSessionCookieBuilder =
  (cookies: ReadonlyRequestCookies) => () => {
    return cookies.get(SESSION_COOKIE_NAME);
  };

export const setSessionCookieBuilder =
  (cookies: ReadonlyRequestCookies) => (sessionId: string, expires: Date) => {
    cookies.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires,
    });
  };

export const deleteSessionCookieBuilder =
  (cookies: ReadonlyRequestCookies) => () => {
    cookies.delete(SESSION_COOKIE_NAME);
  };
