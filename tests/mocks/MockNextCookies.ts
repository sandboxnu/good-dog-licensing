import { mock } from "bun:test";

interface MockReadonlyRequestCookies {
  value: string;
}

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

  readonly set = mock<
    (key: string, value: string) => void
  >().mockImplementation((key, value) => {
    this.cookiesMap.set(key, value);
  });

  readonly get = mock<
    (key: string) => MockReadonlyRequestCookies | undefined
  >().mockImplementation((key) => {
    const cookieValue = this.cookiesMap.get(key);
    if (cookieValue === undefined) {
      return undefined;
    }

    return {
      value: cookieValue,
    };
  });

  readonly delete = mock<(key: string) => void>().mockImplementation((key) => {
    this.cookiesMap.delete(key);
  });
}
