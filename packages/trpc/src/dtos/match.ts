import type { Prisma } from "@good-dog/db";

/**
 * All public match fields including all role-specific status fields.
 * Use when returning match data to any frontend consumer.
 */
export const publicMatchSelect = {
  matchId: true,
  songRequestId: true,
  musicId: true,
  createdAt: true,
  matcherUserId: true,
  matchState: true,
  admModStatus: true,
  mediaMakerStatus: true,
  musicianStatus: true,
} satisfies Prisma.MatchSelect;

export type PublicMatch = Prisma.MatchGetPayload<{
  select: typeof publicMatchSelect;
}>;
