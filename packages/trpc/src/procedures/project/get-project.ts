import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { CREATED_DATE_QUERY, zQueryProjectsRequest } from "../../schema/query";

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
        projectId: true,
        projectTitle: true,
        description: true,
        admModStatus: true,
        projectOwner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        createdAt: true,
        deadline: true,
        projectManager: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            active: true,
            userId: true,
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
        select: {
          projectId: true,
          projectTitle: true,
          description: true,
          additionalInfo: true,
          projectOwnerId: true,
          deadline: true,
          projectOwner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          projectManager: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          songRequests: {
            select: {
              songRequestId: true,
              songRequestTitle: true,
              description: true,
              admModStatus: true,
              mediaMakerStatus: true,
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
