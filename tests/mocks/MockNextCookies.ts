import { mock } from "bun:test";

// A mock for the cookies function in the NextJS next/header module.
export class MockNextCookies {
  private cookiesMap: Map<string, string>;

  constructor() {
    this.cookiesMap = new Map<string, string>();
  }

  // Applies this mock to be the cookies used by the next/header module. This method
  // must be called in order for this mock to be applied.
  async apply(): Promise<void> {
    await mock.module("next/headers", () => ({
      cookies: () => this,
    }));
  }

  set(key: string, value: string): void {
    this.cookiesMap.set(key, value);
  }

  get(key: string): { value: string | undefined } {
    const requestCookie = {
      value: this.cookiesMap.get(key),
    };
    return requestCookie;
  }
}
