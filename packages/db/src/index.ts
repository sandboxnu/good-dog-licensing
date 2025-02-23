import { MatchState, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Re-export prisma types and enums here if needed for other packages
export { Role } from "@prisma/client";

export { MatchState };
export type MatchStateType = keyof typeof MatchState;
