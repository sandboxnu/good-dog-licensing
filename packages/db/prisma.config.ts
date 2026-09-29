import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    // Not using `env()` from "prisma/config" because it throws when the
    // variable is unset, which would break `prisma generate` in CI.
    url: process.env.DATABASE_PRISMA_URL ?? "",
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_PRISMA_URL,
  },
});
