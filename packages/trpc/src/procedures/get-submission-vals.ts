import { MusicContributor } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

export const getMusicSubmissionPrefillValues = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const contributors = await ctx.prisma.musicContributor.findMany({
    where: {
      MusicSubmission: { submitterId: ctx.session.user.userId },
    },
  });

  const createKey = (contributor: MusicContributor): string => {
    const sortedRoles = [...contributor.roles].sort().join(",");
    return `${contributor.name}|${sortedRoles}|${contributor.affiliation}`;
  };

  const submitterName =
    ctx.session.user.firstName + " " + ctx.session.user.lastName;

  const uniqueContributors = Object.values(
    contributors.reduce(
      (acc, contributor) => {
        const key = createKey(contributor);

        if (
          // Should not add the submitter to their own MusicSubmission
          submitterName != contributor.name &&
          // if they aren't in the list or if a prev entry has the same fields but no ipi -> add to list
          (!acc[key] || (!acc[key].ipi && contributor.ipi))
        ) {
          acc[key] = contributor;
        }

        return acc;
      },
      {} as Record<string, MusicContributor>,
    ),
  );

  return {
    contributors: uniqueContributors,
    userAffiliation: ctx.session.user.affiliation,
    userIpi: ctx.session.user.ipi,
  };
});
