import { expect, test } from "bun:test";

import { prisma } from "@good-dog/db";

test("prisma is defined", () => {
  expect(prisma).toBeDefined();
});
