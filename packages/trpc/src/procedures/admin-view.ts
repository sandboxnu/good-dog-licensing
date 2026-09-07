import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";

import { zUserDirectoryRowOutput } from "../dto";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

const zUserDirectoryOutput = z.object({
  users: z.array(zUserDirectoryRowOutput),
});

export const getAdminAndModeratorUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
)
  .output(zUserDirectoryOutput)
  .query(async ({ ctx }) => {
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

// Includes all users, including deactivated.
// Used in the manage users page, which allows admins to activate/deactivate users.
export const getAllUsers = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
)
  .output(zUserDirectoryOutput)
  .query(async ({ ctx }) => {
    const [users] = await Promise.all([
      // Explicit allow-list select (rather than `omit: { hashedPassword }`)
      // so a new sensitive column added to User later isn't returned here
      // just because nobody remembered to omit it too. `.output()` below
      // would strip it anyway, but there's no reason to pull it out of the
      // DB at all.
      ctx.prisma.user.findMany({
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          active: true,
        },
      }),
    ]);
    return { users };
  });
