import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { CREATED_DATE_QUERY, zQueryProjectsRequest } from "../../schema/query";
import {
  publicProjectFullSelect,
  publicProjectSummarySelect,
  publicSongRequestSummarySelect,
  publicUserSummarySelect,
} from "../../dtos";

const getCreatedDate = (query: CREATED_DATE_QUERY) => {
  switch (query) {
    case CREATED_DATE_QUERY.LAST_30_DAYS: {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return thirtyDaysAgo;
    }
    case CREATED_DATE_QUERY.LAST_90_DAYS: {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return ninetyDaysAgo;
    }
    case CREATED_DATE_QUERY.LAST_365_DAYS: {
      const yearAgo = new Date();
      yearAgo.setDate(yearAgo.getDate() - 365);
      return yearAgo;
    }
    case CREATED_DATE_QUERY.ALL_TIME:
      return new Date(2000, 0, 1);
  }
};

export const queryAllProjectsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .input(zQueryProjectsRequest)
  .query(async ({ ctx, input }) => {
    const createdAtDate = getCreatedDate(input.createdDateQuery);
    const projects = await ctx.prisma.projectSubmission.findMany({
      where: {
        createdAt: { gte: createdAtDate },
        ...(input.assignedToMe && {
          projectManagerId: ctx.session.user.userId,
        }),
      },
      select: {
        ...publicProjectSummarySelect,
        projectOwner: { select: publicUserSummarySelect },
        projectManager: { select: publicUserSummarySelect },
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
        select: {
          ...publicProjectFullSelect,
          projectOwner: { select: publicUserSummarySelect },
          projectManager: { select: publicUserSummarySelect },
          songRequests: { select: publicSongRequestSummarySelect },
        },
      });

      if (!projectSubmission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project Song Request ID was not found.`,
        });
      }

      if (
        projectSubmission.projectOwnerId !== ctx.session.user.userId &&
        ctx.session.user.role !== "ADMIN" &&
        ctx.session.user.role !== "MODERATOR"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `You do not have permission to view this project.`,
        });
      }

      return projectSubmission;
    });
