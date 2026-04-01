import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import {
  publicUserFullSelect,
  publicUserSummarySelect,
} from "../dtos";

export const getAdminAndModeratorUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const users = await ctx.prisma.user.findMany({
    where: { role: { in: ["ADMIN", "MODERATOR"] }, active: true },
    select: publicUserSummarySelect,
  });
  return { users };
});

// Includes all users, including deactivated.
// Used in the manage users page, which allows admins to activate/deactivate users.
export const getAllUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const users = await ctx.prisma.user.findMany({
    select: publicUserFullSelect,
  });
  return { users };
});
