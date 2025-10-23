import type { MusicAffiliation } from "@good-dog/db";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

interface ContributorPrefillType {
  name: string;
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
              (!contributorMap[contributor.name] ||
                (!contributorMap[contributor.name]?.ipi && contributor.ipi))
            ) {
              contributorMap[contributor.name] = {
                name: contributor.name,
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
