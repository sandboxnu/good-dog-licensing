import { describe, expect, it, mock } from "bun:test";

import { emailService } from "@good-dog/email";

describe("email service tests", () => {
  describe("getBaseUrl", () => {
    it("gets the correct production url", async () => {
      await mock.module("@good-dog/env", () => ({
        env: {
          VERCEL_ENV: "production",
          VERCEL_URL: "good-dog-licensing-some-random-hash-123.vercel.app",
        },
      }));

      const baseUrl = emailService.getBaseUrl();
      expect(baseUrl).toBe("https://good-dog-licensing.vercel.app");
    });

    it("gets the correct preview deployment url", async () => {
      await mock.module("@good-dog/env", () => ({
        env: {
          VERCEL_ENV: "preview",
          VERCEL_URL: "good-dog-licensing-some-random-hash-123.vercel.app",
        },
      }));

      const baseUrl = emailService.getBaseUrl();
      expect(baseUrl).toBe(
        "https://good-dog-licensing-some-random-hash-123.vercel.app",
      );
    });

    it("gets the correct local url", async () => {
      await mock.module("@good-dog/env", () => ({
        env: {
          VERCEL_ENV: undefined,
          VERCEL_URL: undefined,
        },
      }));

      const baseUrl = emailService.getBaseUrl();
      expect(baseUrl).toBe("http://localhost:3000");
    });
  });
});
