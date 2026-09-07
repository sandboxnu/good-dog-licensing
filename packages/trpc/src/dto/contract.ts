import { z } from "zod";

import { MusicAffiliation, MusicRole } from "@good-dog/db";

/** ContractMusicContributor's own columns, no relations. */
export const zContractMusicContributorOutput = z.object({
  contractMusicContributorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  contractId: z.string(),
  contributorFullName: z.string(),
  contributorRole: z.enum(MusicRole),
  contributorAffiliation: z.enum(MusicAffiliation).nullable(),
  contributorEmail: z.string(),
  contributorPublisher: z.string(),
  contributorPublisherIpi: z.string(),
});

/**
 * Contract's own columns, no relations. Contains PII the two contracting
 * parties already agreed to share with each other (names/phone/email), but
 * never anything about their accounts (no hashedPassword lives on this
 * model at all).
 */
export const zContractOutput = z.object({
  contractId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  matchId: z.string(),
  date: z.date(),
  licensorFullName: z.string(),
  licensorPhone: z.string(),
  licensorEmail: z.string(),
  licensorEntity: z.string(),
  licensorSigned: z.boolean(),
  licenseeFullName: z.string(),
  licenseePhone: z.string(),
  licenseeEmail: z.string(),
  licenseeEntity: z.string(),
  licenseeSigned: z.boolean(),
  productionTitle: z.string(),
  productionDescription: z.string(),
  songRequestDescription: z.string(),
  locationOfUse: z.string(),
  songTitle: z.string(),
});

/** Contract detail view, with just enough of the match chain to authorize viewers. */
export const zContractDetailOutput = zContractOutput.extend({
  contractMusicContributors: z.array(zContractMusicContributorOutput),
  match: z.object({
    musicSubmission: z.object({ submitterId: z.string() }),
    songRequest: z.object({
      projectSubmission: z.object({ projectOwnerId: z.string() }),
    }),
  }),
});
