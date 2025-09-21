import {
  musicianOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

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
    },
  });
  return { music };
});

// TODO - Create tests for this api route. Ticket #150
export const getUnlicensedMusicSubmissionsProcedure =
  rolePermissionsProcedureBuilder(
    projectAndRepertoirePagePermissions,
    "read",
  ).query(async ({ ctx }) => {
    const music = await ctx.prisma.unlicensedMusicSubmission.findMany({});
    return { music };
  });

export const getUserMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    where: {
      artistId: ctx.session.user.userId,
    },
    include: {
      artist: true,
    },
  });
  return { music };
});
