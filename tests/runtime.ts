import React from "react";
import { mock } from "bun:test";

/**
 * Mock the `server-only` module to prevent it from crashing the tests.
 */
await mock.module("server-only", () => {
  return {};
});

/**
 * Mock the `@good-dog/env` module to prevent it from crashing the tests.
 *
 * Bun runtime cannot distinguish between client and server code, so it will
 * crash when it tries to access server-only environment variables.
 */
await mock.module("@good-dog/env", () => ({
  // eslint-disable-next-line no-restricted-properties
  env: process.env,
}));

/**
 * For some reason, the `React` object does not have a `cache` property
 * when running tests. This is a workaround to prevent the tests from
 * crashing.
 */
Object.assign(React, {
  cache: (fn: unknown) => fn,
});
