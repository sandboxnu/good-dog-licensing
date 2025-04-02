import { adminPagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getModeratorsAndAdminsProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
).query(async ({ ctx }) => {
  const [signedUpPeople, pendingModerators] = await ctx.prisma.$transaction([
    // Get all moderators and admins who are signed up
    ctx.prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MODERATOR"] },
      },
      select: {
        email: true,
        role: true,
      },
    }),
    // Get all moderators who have pending, valid invites
    ctx.prisma.moderatorInvite.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      select: {
        email: true,
      },
    }),
  ]);

  const signedUpPeopleFinal = signedUpPeople.map((person) => {
    return {
      ...person,
      status: "ACTIVE",
    };
  });

  const pendingModeratorsFinal = pendingModerators.map((moderator) => {
    return {
      ...moderator,
      role: "MODERATOR",
      status: "PENDING",
    };
  });

  return [...pendingModeratorsFinal, ...signedUpPeopleFinal].sort(
    (user1, user2) => {
      return user1.email.localeCompare(user2.email);
    },
  );
});
