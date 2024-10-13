import { mock } from "bun:test";

// A mock for the cookies function in the NextJS next/header module.
export class MockNextCookies {
  private cookiesMap: Map<string, string>;

  constructor() {
    this.cookiesMap = new Map<string, string>();
    mock.module("next/headers", () => ({
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
