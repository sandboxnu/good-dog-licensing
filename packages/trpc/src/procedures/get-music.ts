import { projectAndRepetoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepetoirePagePermissions,
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
