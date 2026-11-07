import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { MusicAffiliation } from "@good-dog/db";
import { musicianOnlyPermissions } from "@good-dog/auth/permissions";
import { Role } from "@good-dog/db";

import { zMusicSubmissionPrefillOutput } from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

interface ContributorPrefillType {
  firstName: string;
  lastName: string;
  email: string | null;
  affiliation: MusicAffiliation | null;
  otherAffiliationName: string | null;
  ipi: string | null;
  publisher: string | null;
  publisherIpi: string | null;
}

export const getMusicSubmissionPrefillValuesProcedure =
  rolePermissionsProcedureBuilder(musicianOnlyPermissions, "read")
    // Admins posting a song for a musician pass `musicianId` to get that
    // musician's prefill values instead of their own.
    .input(z.object({ musicianId: z.string().optional() }).optional())
    .output(zMusicSubmissionPrefillOutput)
    .query(async ({ ctx, input }) => {
      let submitter = ctx.session.user;
      if (input?.musicianId) {
        if (ctx.session.user.role !== Role.ADMIN) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can submit music for another musician.",
          });
        }
        const musician = await ctx.prisma.user.findUnique({
          where: { userId: input.musicianId },
        });
        if (musician?.role !== Role.MUSICIAN) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Musician not found.",
          });
        }
        submitter = musician;
      }

      const previousContributors = await ctx.prisma.musicContributor.findMany({
        where: {
          MusicSubmission: { submitterId: submitter.userId },
        },
      });

      previousContributors.reverse();

      const uniqueContributors = Object.values(
        previousContributors.reduce<Record<string, ContributorPrefillType>>(
          (contributorMap, contributor) => {
            if (
              // Should not add the submitter (their info goes in sepearely)
              !contributor.isSubmitter &&
              // if they aren't in the list or if a prev entry has the same name but no ipi -> add to list
              (!contributorMap[contributor.firstName && contributor.lastName] ||
                (!contributorMap[contributor.firstName && contributor.lastName]
                  ?.ipi &&
                  contributor.ipi))
            ) {
              contributorMap[contributor.firstName && contributor.lastName] = {
                firstName: contributor.firstName,
                lastName: contributor.lastName,
                email: contributor.email,
                affiliation: contributor.affiliation,
                otherAffiliationName: contributor.otherAffiliationName,
                ipi: contributor.ipi,
                publisher: contributor.publisher,
                publisherIpi: contributor.publisherIpi,
              };
            }

            return contributorMap;
          },
          {},
        ),
      );

      return {
        contributors: uniqueContributors,
        userAffiliation: submitter.affiliation,
        userOtherAffiliationName: submitter.otherAffiliationName,
        userIpi: submitter.ipi,
        userPublisher: submitter.publisher,
        userPublisherIpi: submitter.publisherIpi,
      };
    });
