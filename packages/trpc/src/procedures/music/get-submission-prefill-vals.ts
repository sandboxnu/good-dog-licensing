import type { MusicAffiliation } from "@good-dog/db";
import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

interface ContributorPrefillType {
  firstName: string;
  lastName: string;
  affiliation: MusicAffiliation | null;
  ipi: string | null;
}

export const getMusicSubmissionPrefillValuesProcedure =
  rolePermissionsProcedureBuilder(musicianOnlyPermissions, "read").query(
    async ({ ctx }) => {
      const previousContributors = await ctx.prisma.musicContributor.findMany({
        where: {
          MusicSubmission: { submitterId: ctx.session.user.userId },
        },
      });

      const uniqueContributors = Object.values(
        previousContributors.reduce<Record<string, ContributorPrefillType>>(
          (contributorMap, contributor) => {
            if (
              // Should not add the submitter (their info goes in sepearely)
              !contributor.isSubmitter &&
              // if they aren't in the list or if a prev entry has the same name but no ipi -> add to list
              (!contributorMap[contributor.firstName && contributor.lastName] ||
                (!contributorMap[contributor.firstName && contributor.lastName]?.ipi && contributor.ipi))
            ) {
              contributorMap[contributor.firstName && contributor.lastName] = {
                firstName: contributor.firstName,
                lastName: contributor.lastName,
                affiliation: contributor.affiliation,
                ipi: contributor.ipi,
              };
            }

            return contributorMap;
          },
          {},
        ),
      );

      return {
        contributors: uniqueContributors,
        userAffiliation: ctx.session.user.affiliation,
        userIpi: ctx.session.user.ipi,
      };
    },
  );
