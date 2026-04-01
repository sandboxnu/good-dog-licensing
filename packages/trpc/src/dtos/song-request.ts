import type { Prisma } from "@good-dog/db";

/**
 * Minimal song request fields for list views (e.g. project detail page).
 */
export const publicSongRequestSummarySelect = {
  songRequestId: true,
  songRequestTitle: true,
  description: true,
  createdAt: true,
  admModStatus: true,
  mediaMakerStatus: true,
  projectId: true,
} satisfies Prisma.SongRequestSelect;

export type PublicSongRequestSummary = Prisma.SongRequestGetPayload<{
  select: typeof publicSongRequestSummarySelect;
}>;

/**
 * Full song request detail — all public fields including brief content.
 * Use for individual song request views and when matches/comments are nested.
 */
export const publicSongRequestFullSelect = {
  songRequestId: true,
  songRequestTitle: true,
  description: true,
  feelingsConveyed: true,
  similarSongs: true,
  additionalInfo: true,
  createdAt: true,
  admModStatus: true,
  mediaMakerStatus: true,
  projectId: true,
} satisfies Prisma.SongRequestSelect;

export type PublicSongRequestFull = Prisma.SongRequestGetPayload<{
  select: typeof publicSongRequestFullSelect;
}>;
