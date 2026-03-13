import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getAdminAndModeratorUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const [users] = await Promise.all([
    ctx.prisma.user.findMany({
      where: { role: { in: ["ADMIN", "MODERATOR"] }, active: true },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        active: true,
        userId: true,
      },
    }),
  ]);
  return { users };
});
