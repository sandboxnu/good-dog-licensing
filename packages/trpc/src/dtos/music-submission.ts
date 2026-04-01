import type { Prisma } from "@good-dog/db";

/**
 * All fields of a music contributor — safe for the frontend.
 */
export const publicMusicContributorSelect = {
  contributorId: true,
  firstName: true,
  lastName: true,
  roles: true,
  affiliation: true,
  ipi: true,
  musicSubmissionId: true,
  isSubmitter: true,
} satisfies Prisma.MusicContributorSelect;

export type PublicMusicContributor = Prisma.MusicContributorGetPayload<{
  select: typeof publicMusicContributorSelect;
}>;

/**
 * Minimal music submission fields for list views (e.g. musician's my-music page).
 */
export const publicMusicSubmissionSummarySelect = {
  musicId: true,
  songName: true,
  performerName: true,
  createdAt: true,
  genres: true,
  musicianSongStatus: true,
  submitterId: true,
} satisfies Prisma.MusicSubmissionSelect;

export type PublicMusicSubmissionSummary = Prisma.MusicSubmissionGetPayload<{
  select: typeof publicMusicSubmissionSummarySelect;
}>;

/**
 * Full music submission detail — all public fields.
 * Use for individual music views and when contributors/matches are nested.
 */
export const publicMusicSubmissionFullSelect = {
  musicId: true,
  songName: true,
  performerName: true,
  createdAt: true,
  genres: true,
  additionalInfo: true,
  songLink: true,
  musicianSongStatus: true,
  submitterId: true,
} satisfies Prisma.MusicSubmissionSelect;

export type PublicMusicSubmissionFull = Prisma.MusicSubmissionGetPayload<{
  select: typeof publicMusicSubmissionFullSelect;
}>;
