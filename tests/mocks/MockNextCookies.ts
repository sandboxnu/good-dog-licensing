import { mock } from "bun:test";

interface MockReadonlyRequestCookies {
  value: string;
  data?: Record<string, unknown>;
}

// A mock for the cookies function in the NextJS next/header module.
export class MockNextCookies {
  private cookieJar: Map<string, MockReadonlyRequestCookies>;

  constructor() {
    this.cookieJar = new Map();
  }

  // Applies this mock to be the cookies used by the next/header module. This method
  // must be called in order for this mock to be applied.
  async apply(): Promise<void> {
    await mock.module("next/headers", () => ({
      cookies: () => this,
    }));
  }

  // Clears the cookie jar and clears the mock functions.
  clear() {
    this.cookieJar.clear();
    this.set.mockClear();
    this.get.mockClear();
    this.delete.mockClear();
  }

  readonly set = mock<
    (
      key: string,
      value: string,
      data?: MockReadonlyRequestCookies["data"],
    ) => void
  >().mockImplementation((key, value, data) => {
    this.cookieJar.set(key, {
      value,
      data,
    });
  });

  readonly get = mock<
    (key: string) => MockReadonlyRequestCookies | undefined
  >().mockImplementation((key) => {
    return this.cookieJar.get(key);
  });

  readonly delete = mock<(key: string) => void>().mockImplementation((key) => {
    this.cookieJar.delete(key);
  });
}
