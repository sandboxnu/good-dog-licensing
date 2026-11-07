import type z from "zod";

import type { zMusicSubmissionValues } from "../../schema";

type MusicSubmissionValues = z.infer<typeof zMusicSubmissionValues>;

interface SubmitterInfo {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * The musician who owns a submission is stored as one of its contributors
 * (with `isSubmitter: true`). Shared by the regular musician submission flow
 * and the admin "post for musician" flow so both produce identical records.
 */
export function buildSubmitterContributor(
  submitter: SubmitterInfo,
  input: MusicSubmissionValues,
) {
  return {
    firstName: submitter.firstName,
    lastName: submitter.lastName,
    roles: input.submitterRoles,
    affiliation: input.submitterAffiliation,
    otherAffiliationName: input.submitterOtherAffiliationName,
    ipi: input.submitterIpi,
    publisher: input.submitterPublisher,
    publisherIpi: input.submitterPublisherIpi,
    isSubmitter: true,
    email: submitter.email,
  };
}

/** Profile fields saved back onto the musician's User record on submission. */
export function buildSubmitterProfileUpdate(input: MusicSubmissionValues) {
  return {
    ipi: input.submitterIpi === "" ? undefined : input.submitterIpi,
    affiliation: input.submitterAffiliation,
    otherAffiliationName:
      input.submitterOtherAffiliationName === ""
        ? undefined
        : input.submitterOtherAffiliationName,
  };
}

/** The song-level fields of a submission (everything but contributors). */
export function buildSongFields(input: MusicSubmissionValues) {
  return {
    songName: input.songName,
    songLink: input.songLink,
    genres: input.genres,
    additionalInfo: input.additionalInfo ?? "",
    songLyrics: input.songLyrics,
    performerName: input.performerName,
  };
}
