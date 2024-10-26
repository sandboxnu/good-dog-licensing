import { afterEach, beforeAll, describe, expect, test } from "bun:test";

import {
  deleteSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@good-dog/auth/cookies";

import { MockNextCookies } from "../mocks/MockNextCookies";

describe("cookies", () => {
  const cookies = new MockNextCookies();

  beforeAll(async () => {
    await cookies.apply();
  });

  afterEach(() => {
    cookies.clear();
  });

  describe("session cookie", () => {
    test("get unset cookie", () => {
      const result = getSessionCookie();

      expect(result).toBeUndefined();
      expect(cookies.get).toHaveBeenCalledWith("sessionId");
    });

    test("get cookie with value", () => {
      cookies.set("sessionId", "123");

      const result = getSessionCookie();

      expect(result?.value).toBe("123");
      expect(cookies.get).toHaveBeenCalledWith("sessionId");
    });

    test("set cookie", () => {
      const expires = new Date(Date.now() + 1000000);
      setSessionCookie("abc-123-def-456", expires);

      expect(cookies.set).toHaveBeenCalledWith("sessionId", "abc-123-def-456", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        expires,
      });
      expect(cookies.get("sessionId")?.value).toBe("abc-123-def-456");
    });

    test("delete cookie", () => {
      cookies.set("sessionId", "zyx-987-wvu-654");

      deleteSessionCookie();

      expect(cookies.delete).toHaveBeenCalledWith("sessionId");
      expect(cookies.get("sessionId")).toBeUndefined();
    });

    test("setting, getting, and deleting a cookie", () => {
      const expires = new Date(Date.now() + 1000000);
      setSessionCookie("abc-123-def-456", expires);

      expect(cookies.get("sessionId")?.value).toBe("abc-123-def-456");

      const result = getSessionCookie();

      expect(result?.value).toBe("abc-123-def-456");

      deleteSessionCookie();

      expect(cookies.get("sessionId")).toBeUndefined();
    });
  });
});
