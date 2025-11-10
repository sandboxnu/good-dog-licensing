import {
  musicianOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    include: {
      submitter: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return { music };
});

export const getUserMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    where: {
      submitterId: ctx.session.user.userId,
    },
    include: {
      submitter: true,
      matches: true,
    },
  });
  return { music };
});
