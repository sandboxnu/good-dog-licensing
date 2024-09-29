import { expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

test("hello world", async () => {
  const result = await _trpcCaller.hello({ text: "world" });

  expect(result.greeting).toEqual("hello world");
});
