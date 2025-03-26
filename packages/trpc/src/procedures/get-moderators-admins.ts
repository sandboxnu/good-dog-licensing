import { adminAuthenticatedProcedureBuilder } from "../middleware/admin";

export const getModeratorsAndAdminsProcedure =
  adminAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    // Get all moderators and admins who are signed up
    const signedUpPeople = await ctx.prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "MODERATOR"] },
      },
      select: {
        email: true,
        role: true,
      },
    });
    const signedUpPeopleFinal = signedUpPeople.map((person) => {
      return {
        ...person,
        status: "ACTIVE",
      };
    });

    // Get all moderators who have pending, valid invites
    const pendingModerators = await ctx.prisma.moderatorInvite.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      select: {
        email: true,
      },
    });
    const pendingModeratorsFinal = pendingModerators.map((moderator) => {
      return {
        ...moderator,
        role: "MODERATOR",
        status: "PENDING",
      };
    });

    return [...pendingModeratorsFinal, ...signedUpPeopleFinal];
  });
