import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";
import {
  AdmModProjectStatus,
  AdmModSongRequestStatus,
  MediaMakerSongRequestStatus,
} from "@good-dog/db";

import {
  zUserDirectoryRowOutput,
  zUserNameOutput,
  zUserSummaryOutput,
} from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
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

// Row in the admin/PNR "all projects" list.
const zProjectDirectoryRowOutput = z.object({
  projectId: z.string(),
  projectTitle: z.string(),
  description: z.string(),
  admModStatus: z.enum(AdmModProjectStatus),
  projectOwner: zUserNameOutput,
  createdAt: z.date(),
  deadline: z.date(),
  // Candidates eligible to be assigned as project manager - same shape as
  // the admin/PNR directory row since that's exactly what this is.
  projectManager: zUserDirectoryRowOutput.nullable(),
});

export const queryAllProjectsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .input(zQueryProjectsRequest)
  .output(z.object({ projects: z.array(zProjectDirectoryRowOutput) }))
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

const zProjectSubmissionDetailOutput = z.object({
  projectId: z.string(),
  projectTitle: z.string(),
  description: z.string(),
  additionalInfo: z.string(),
  projectOwnerId: z.string(),
  deadline: z.date(),
  projectOwner: zUserNameOutput,
  projectManager: zUserSummaryOutput.nullable(),
  songRequests: z.array(
    z.object({
      songRequestId: z.string(),
      songRequestTitle: z.string(),
      description: z.string(),
      admModStatus: z.enum(AdmModSongRequestStatus),
      mediaMakerStatus: z.enum(MediaMakerSongRequestStatus),
    }),
  ),
});

export const getProjectSubmissionByIdProcedure =
  rolePermissionsProcedureBuilder(mediaMakerOnlyPermissions, "read")
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .output(zProjectSubmissionDetailOutput)
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
              userId: true,
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
