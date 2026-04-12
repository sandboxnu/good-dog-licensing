import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { allUsersPermissions } from "@good-dog/auth/permissions";
import { Role } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

export const signContractLicensorProcedure = rolePermissionsProcedureBuilder(
  allUsersPermissions,
  "read",
)
  .input(z.object({ contractId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const contract = await ctx.prisma.contract.findUnique({
      where: { contractId: input.contractId },
      include: {
        match: {
          include: {
            musicSubmission: {
              select: { submitterId: true },
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
    const isLicensor =
      role === Role.MUSICIAN &&
      contract.match.musicSubmission.submitterId === userId;

    if (!isLicensor) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only the licensor may sign this contract.",
      });
    }

    if (contract.licensorSigned) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Contract has already been signed.",
      });
    }

    return ctx.prisma.contract.update({
      where: { contractId: input.contractId },
      data: { licensorSigned: true },
    });
  });

export const signContractLicenseeProcedure = rolePermissionsProcedureBuilder(
  allUsersPermissions,
  "read",
)
  .input(z.object({ contractId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const contract = await ctx.prisma.contract.findUnique({
      where: { contractId: input.contractId },
      include: {
        match: {
          include: {
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
    const isLicensee =
      role === Role.MEDIA_MAKER &&
      contract.match.songRequest.projectSubmission.projectOwnerId === userId;

    if (!isLicensee) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only the licensee may sign this contract.",
      });
    }

    if (contract.licenseeSigned) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Contract has already been signed.",
      });
    }

    return ctx.prisma.contract.update({
      where: { contractId: input.contractId },
      data: { licenseeSigned: true },
    });
  });
