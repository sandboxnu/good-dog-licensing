import React from "react";
import { mock } from "bun:test";

/**
 * Mock the `server-only` module to prevent it from crashing the tests.
 */
await mock.module("server-only", () => {
  return {};
});

/**
 * For some reason, the `React` object does not have a `cache` property
 * when running tests. This is a workaround to prevent the tests from
 * crashing.
 */
Object.assign(React, {
  cache: (fn: unknown) => fn,
});
