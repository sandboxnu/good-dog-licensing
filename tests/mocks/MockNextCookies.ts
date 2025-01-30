import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { mock } from "bun:test";

interface CookieItem {
  value: string;
  name: string;
}

// A mock for the cookies function in the NextJS next/header module.
export class MockNextCookies implements ReadonlyRequestCookies {
  private cookieJar: Map<string, CookieItem>;

  [Symbol.iterator](): IterableIterator<[string, CookieItem]> {
    return this.cookieJar.entries();
  }

  get size(): number {
    return this.cookieJar.size;
  }

  constructor() {
    this.cookieJar = new Map();
  }

  // Overrides the cookies function in the next/headers module.
  async mockModule(): Promise<void> {
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

  readonly set = mock<ReadonlyRequestCookies["set"]>().mockImplementation(
    (...args) => {
      if (args.length != 1) {
        const [key, value] = args;
        this.cookieJar.set(key, {
          value,
          name: key,
        });
        return this;
      } else {
        throw new Error("Not yet implemented");
      }
    },
  );

  readonly get = mock<ReadonlyRequestCookies["get"]>().mockImplementation(
    (arg) => {
      if (typeof arg === "string") {
        return this.cookieJar.get(arg);
      } else {
        throw new Error("Not yet implemented");
      }
    },
  );

  readonly delete = mock<ReadonlyRequestCookies["delete"]>().mockImplementation(
    (arg) => {
      if (typeof arg === "string") {
        this.cookieJar.delete(arg);
        return this;
      } else {
        throw new Error("Not yet implemented");
      }
    },
  );

  readonly getAll = mock<ReadonlyRequestCookies["getAll"]>().mockImplementation(
    () => {
      return Array.from(this.cookieJar.values());
    },
  );

  readonly has = mock<ReadonlyRequestCookies["has"]>().mockImplementation(
    (name: string) => {
      return this.cookieJar.has(name);
    },
  );
}
