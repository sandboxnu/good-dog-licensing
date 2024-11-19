import { adminAuthenticatedProcedureBuilder } from "../internal/init";

export const userView = adminAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const users = ctx.prisma.user.findMany();

    return users;
  },
);

export const groupView = adminAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const groups = ctx.prisma.group.findMany();

    return groups;
  },
);

export const groupInvitesView = adminAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const groupInvites = ctx.prisma.groupInvite.findMany();

    return groupInvites;
  },
);
