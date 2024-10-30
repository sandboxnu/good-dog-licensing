import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "sessionId";

export const getSessionCookie = () => {
  return cookies().get(SESSION_COOKIE_NAME);
};

export const setSessionCookie = (sessionId: string, expires: Date) => {
  cookies().set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires,
  });
};

export const deleteSessionCookie = () => {
  cookies().delete(SESSION_COOKIE_NAME);
};
