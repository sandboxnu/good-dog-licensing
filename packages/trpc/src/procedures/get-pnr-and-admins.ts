import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";

import { zPnrOrAdminRowOutput } from "../dto";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getPNRandAdminsProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
)
  .output(z.array(zPnrOrAdminRowOutput))
  .query(async ({ ctx }) => {
    const [signedUpPeople, pendingPNRs] = await ctx.prisma.$transaction([
      // Get all pnrs and admins who are signed up
      ctx.prisma.user.findMany({
        where: {
          role: { in: ["ADMIN", "MODERATOR"] },
        },
        select: {
          email: true,
          role: true,
        },
      }),
      // Get all pnrs who have pending, valid invites
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
        status: "ACTIVE" as const,
      };
    });

    const pendingPNRsFinal = pendingPNRs.map((pnr) => {
      return {
        ...pnr,
        role: "MODERATOR",
        status: "PENDING" as const,
      };
    });

    return [...pendingPNRsFinal, ...signedUpPeopleFinal].sort(
      (user1, user2) => {
        return user1.email.localeCompare(user2.email);
      },
    );
  });
