import { cookies } from "next/headers";

export const setSessionCookie = (sessionId: string, expires: Date) => {
  cookies().set("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
};

export const deleteSessionCookie = () => {
  cookies().delete("sessionId");
};
