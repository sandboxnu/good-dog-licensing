import { MatchState, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export { MatchState };
export type MatchStateType = keyof typeof MatchState;
