import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getAdminViewProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const [users, groups] = await Promise.all([
    ctx.prisma.user.findMany({ omit: { hashedPassword: true } }),
    ctx.prisma.musicianGroup.findMany({
      include: {
        organizer: true,
        groupMembers: true,
      },
    }),
  ]);
  return { users, groups };
});
