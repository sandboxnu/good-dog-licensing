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
      artist: true,
      group: true,
      songwriters: true,
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
      artistId: ctx.session.user.userId,
    },
    include: {
      artist: true,
      group: true,
      songwriters: true,
    },
  });
  return { music };
});
