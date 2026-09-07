import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { allUsersPermissions } from "@good-dog/auth/permissions";
import { Role } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

export const getContractByIdProcedure = rolePermissionsProcedureBuilder(
  allUsersPermissions,
  "read",
)
  .input(z.object({ contractId: z.string() }))
  .query(async ({ ctx, input }) => {
    const contract = await ctx.prisma.contract.findUnique({
      where: { contractId: input.contractId },
      include: {
        contractMusicContributors: true,
        match: {
          include: {
            musicSubmission: {
              select: { submitterId: true },
            },
            songRequest: {
              include: {
                projectSubmission: {
                  select: { projectOwnerId: true },
                },
              },
            },
          },
        },
      },
    });

    if (!contract) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contract not found.",
      });
    }

    const { role, userId } = ctx.session.user;
    const isAdminOrMod = role === Role.ADMIN || role === Role.MODERATOR;
    const isLicensor =
      role === Role.MUSICIAN &&
      contract.match.musicSubmission.submitterId === userId;
    const isLicensee =
      role === Role.MEDIA_MAKER &&
      contract.match.songRequest.projectSubmission.projectOwnerId === userId;

    if (!isAdminOrMod && !isLicensor && !isLicensee) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view this contract.",
      });
    }

    return contract;
  });
