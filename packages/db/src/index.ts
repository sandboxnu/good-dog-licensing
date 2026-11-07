import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "@good-dog/env";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_PRISMA_URL }),
});

// Re-export prisma types and enums here if needed for other packages
export * from "./enums";
