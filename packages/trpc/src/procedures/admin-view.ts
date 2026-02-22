import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getAdminAndModeratorUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const [users] = await Promise.all([
    ctx.prisma.user.findMany({
      where: { role: { in: ["ADMIN", "MODERATOR"] }, active: true },
      omit: { hashedPassword: true },
    }),
  ]);
  return { users };
});
