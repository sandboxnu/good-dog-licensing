import { z } from "zod";

import {
  Genre,
  MusicAffiliation,
  MusicianSongStatus,
  MusicRole,
} from "@good-dog/db";

import { zUserNameOutput } from "./user";

/** MusicContributor's own columns. No relations, nothing sensitive. */
export const zMusicContributorOutput = z.object({
  contributorId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roles: z.array(z.enum(MusicRole)),
  affiliation: z.enum(MusicAffiliation).nullable(),
  ipi: z.string().nullable(),
  musicSubmissionId: z.string(),
  isSubmitter: z.boolean(),
  email: z.string().nullable(),
  publisher: z.string().nullable(),
  publisherIpi: z.string().nullable(),
});

/**
 * MusicSubmission's own columns, no relations. As with projects, the risk
 * is always in the `submitter` relation - attach {@link zUserNameOutput}
 * explicitly rather than the full `User` record.
 */
export const zMusicSubmissionOutput = z.object({
  musicId: z.string(),
  songName: z.string(),
  performerName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  submitterId: z.string(),
  songLink: z.string(),
  genres: z.array(z.enum(Genre)),
  additionalInfo: z.string(),
  songLyrics: z.string(),
  musicianSongStatus: z.enum(MusicianSongStatus),
});

/** Row in the admin/PNR "all music" list. */
export const zMusicSubmissionAdminRowOutput = zMusicSubmissionOutput.extend({
  submitter: zUserNameOutput,
  contributors: z.array(zMusicContributorOutput),
});

/** Row in a musician's own "my submissions" list. */
export const zUserMusicSubmissionRowOutput = z.object({
  musicId: z.string(),
  songName: z.string(),
  createdAt: z.date(),
  performerName: z.string(),
  genres: z.array(z.enum(Genre)),
  musicianSongStatus: z.enum(MusicianSongStatus),
});

/** Prefill values shown when a musician starts a new submission. */
export const zMusicSubmissionPrefillOutput = z.object({
  contributors: z.array(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().nullable(),
      affiliation: z.enum(MusicAffiliation).nullable(),
      ipi: z.string().nullable(),
      publisher: z.string().nullable(),
      publisherIpi: z.string().nullable(),
    }),
  ),
  userAffiliation: z.enum(MusicAffiliation).nullable(),
  userIpi: z.string().nullable(),
  userPublisher: z.string().nullable(),
  userPublisherIpi: z.string().nullable(),
});
