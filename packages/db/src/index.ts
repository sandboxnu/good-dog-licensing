import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "@good-dog/env";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_PRISMA_URL,
    // Every serverless function instance gets its own pool, and the
    // database's pooler caps the total number of clients (Supabase session
    // mode: 15 on preview). pg's default of 10 connections per pool let a
    // couple of instances exhaust it ("EMAXCONNSESSION max clients reached"),
    // which failed every query, including the session lookup, so users
    // looked logged out. Keep each pool small and release idle connections
    // quickly. Extra queries wait for a free connection instead of failing.
    max: 3,
    idleTimeoutMillis: 5_000,
  }),
});

// Re-export prisma types and enums here if needed for other packages
export * from "./enums";
