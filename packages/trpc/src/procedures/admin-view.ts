import { adminAuthenticatedProcedureBuilder } from "../internal/init";

export const getAdminViewProcedure = adminAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const [users, groups, groupInvites] = await Promise.all([
      ctx.prisma.user.findMany({ omit: { hashedPassword: true } }),
      ctx.prisma.group.findMany(),
      ctx.prisma.groupInvite.findMany(),
    ]);
    return { users, groups, groupInvites };
  },
);
