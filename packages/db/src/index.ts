import { PrismaClient, Role } from "@prisma/client";

export const prisma = new PrismaClient();

// Re-export prisma types and enums here if needed for other packages

export { Role, MatchState, ReferralSource } from "@prisma/client";

