import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getMusicianGroupProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const musicianGroup = await ctx.prisma.musicianGroup.findFirst({
    where: {
      organizerId: ctx.session.user.userId,
    },
  });

  return musicianGroup;
});
