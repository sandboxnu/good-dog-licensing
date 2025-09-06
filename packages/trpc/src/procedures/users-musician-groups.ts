import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const usersMusicianGroupsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  return await ctx.prisma.musicianGroup.findMany({
    where: {
      organizerId: ctx.session.user.userId,
    },
    include: {
      organizer: true,
      groupMembers: true,
    },
  });
});
