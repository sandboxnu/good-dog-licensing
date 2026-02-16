import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const getAllProjectsWithSongRequestsAndMatchesProcedure =
  rolePermissionsProcedureBuilder(
    projectAndRepertoirePagePermissions,
    "read",
  ).query(async ({ ctx }) => {
    const projects = await ctx.prisma.projectSubmission.findMany({
      include: {
        projectOwner: true,
        songRequests: {
          include: {
            matches: true,
          },
        },
      },
    });
    return { projects };
  });

export const getProjectSubmissionByIdProcedure =
  rolePermissionsProcedureBuilder(mediaMakerOnlyPermissions, "read")
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const projectSubmission = await ctx.prisma.projectSubmission.findUnique({
        where: {
          projectId: input.projectId,
        },
        include: {
          projectOwner: true,
          projectManager: true,
          songRequests: {
            include: {
              matches: true,
            },
          },
        },
      });

      if (!projectSubmission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project Song Request ID was not found.`,
        });
      }

      if (projectSubmission.projectOwnerId !== ctx.session.user.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You do not have permission to view this song request.`,
        });
      }

      return projectSubmission;
    });
