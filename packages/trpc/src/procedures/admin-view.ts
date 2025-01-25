import { adminAuthenticatedProcedureBuilder } from "../internal/init";

export const getAdminViewProcedure = adminAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const [users, groups] = await Promise.all([
      ctx.prisma.user.findMany({ omit: { hashedPassword: true } }),
      ctx.prisma.musicianGroup.findMany({
        include: {
          user: true,
          groupMembers: true,
        },
      }),
    ]);
    return { users, groups };
  },
);
