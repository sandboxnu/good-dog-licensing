# Tests

## Endpoint Integration Testing

You can write integrations tests for your tRPC procedures using the `$createTrpcCaller` export.

This will return an api caller function that with the specified context and services.

```ts
import { expect, test } from "bun:test";

import { $createTrpcCaller } from "@good-dog/trpc/server";

const $api = $createTrpcCaller({
  /**
   * Here you attach your services you need.
   *
   * Let's say we wanted to mock a service used by the hello procedure
   * used to generate a greeting. We can mock the service here.
   */
  helloService: (str: string) => `hello ${str}`,
});

test("hello world", async () => {
  const result = await $trpcCaller.hello({ text: "world" });
  expect(result.greeting).toEqual("hello world");
});
```

## Mocks

### MockNextCookies

This module implements all functionality of the `cookies()` function from Next.js, but in a mockable way. This is useful for testing components that rely on cookies.

Example usage:

```ts
const cookies = new MockNextCookies();

const $api = $createTrpcCaller({
  cookiesService: createMockCookieService(mockCookies),
});

afterEach(() => {
  cookies.clear();
});

test(() => {
  await $api.someProcedure();

  expect(cookies.get).toHaveBeenCalledWith("cookie-name");
});
```

## MockEmailService

This module extends our email service to allow for mocking of the actual "send" function. This is useful for testing components that rely on sending emails.

It also overrides the default behavior of the randomized 6-digit code generator to always return the same code.

## Running Tests

You can run the entire test suite using `bun test` or run the tests for a specific entrypoint, `bun test <file-path>`. To filter tests by name, use `bun test <file-path> -t <test-name>`. For example, to run all tests for the `frontend` folder, you can run `bun test frontend`.
