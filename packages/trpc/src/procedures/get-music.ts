import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    include: {
      artist: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      group: {
        select: {
          name: true,
        },
      },
      songwriters: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return { music };
});

export const getUnlicensedMusicSubmissionsProcedure =
  rolePermissionsProcedureBuilder(
    projectAndRepertoirePagePermissions,
    "read",
  ).query(async ({ ctx }) => {
    const music = await ctx.prisma.unlicensedMusicSubmission.findMany({});
    return { music };
  });
