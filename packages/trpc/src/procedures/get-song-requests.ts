import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import {
  zMatchWithMusicContextOutput,
  zMediaMakerProjectRowOutput,
  zProjectSubmissionOutput,
  zProjectWithSongRequestsRowOutput,
  zSongRequestOutput,
  zUserNameOutput,
  zUserSummaryOutput,
} from "../dto";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectSongRequestsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .output(z.object({ projects: z.array(zProjectWithSongRequestsRowOutput) }))
  .query(async ({ ctx }) => {
    const projectsRaw = await ctx.prisma.projectSubmission.findMany({
      include: {
        songRequests: true,
        projectOwner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const projects = projectsRaw.map((project) => {
      return {
        ...project,
        createdAtDateString: project.createdAt.toDateString(),
      };
    });

    return { projects };
  });

// The detail view for a single song request: the request itself, its
// project's owner/manager (name only - never the full User record), every
// match suggested for it, and its comment thread.
const zSongRequestDetailOutput = zSongRequestOutput.extend({
  projectSubmission: zProjectSubmissionOutput.extend({
    // Both link out to the user's profile (id() below), so these need the
    // id as well as the name.
    projectManager: zUserSummaryOutput.nullable(),
    projectOwner: zUserSummaryOutput,
  }),
  matches: z.array(zMatchWithMusicContextOutput),
  comments: z.array(
    z.object({
      commentId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      commentText: z.string(),
      userId: z.string(),
      songRequestId: z.string().nullable(),
      user: zUserNameOutput,
    }),
  ),
});

// TODO - Test this api route. Ticket #149
export const getProjectSongRequestByIdProcedure =
  rolePermissionsProcedureBuilder(mediaMakerOnlyPermissions, "read")
    .input(
      z.object({
        songRequestId: z.string(),
      }),
    )
    .output(zSongRequestDetailOutput)
    .query(async ({ ctx, input }) => {
      const songRequest = await ctx.prisma.songRequest.findUnique({
        where: {
          songRequestId: input.songRequestId,
        },
        include: {
          projectSubmission: {
            include: {
              projectManager: true,
              projectOwner: true,
            },
          },
          matches: {
            include: {
              musicSubmission: {
                include: {
                  contributors: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                  submitter: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
              contract: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!songRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Project Song Request ID was not found.`,
        });
      }

      if (
        songRequest.projectSubmission.projectOwnerId !==
          ctx.session.user.userId &&
        ctx.session.user.role !== "ADMIN" &&
        ctx.session.user.role !== "MODERATOR"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this song request.",
        });
      }

      return songRequest;
    });

export const getUserSongRequestsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .output(
    z.object({
      projects: z.array(
        zProjectSubmissionOutput.extend({
          songRequests: z.array(zSongRequestOutput),
          projectOwner: zUserNameOutput,
        }),
      ),
    }),
  )
  .query(async ({ ctx }) => {
    const projects = await ctx.prisma.projectSubmission.findMany({
      where: {
        projectOwnerId: ctx.session.user.userId,
      },
      include: {
        songRequests: true,
        projectOwner: true,
      },
    });
    return { projects };
  });

// TODO: test these procedures as mentioned in #152

// gets all of the projects belonging to a mediamaker
export const mediamakerProjectsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .output(z.object({ projects: z.array(zMediaMakerProjectRowOutput) }))
  .query(async ({ ctx }) => {
    const projects = await ctx.prisma.projectSubmission.findMany({
      where: {
        projectOwnerId: ctx.session.user.userId,
      },
      select: {
        projectId: true,
        projectTitle: true,
        createdAt: true,
        description: true,
        mediaMakerStatus: true,
      },
    });

    return { projects };
  });

//gets all of the song requests belonging to a project for a mediamaker
export const mediamakerSongRequestsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .input(
    z.object({
      projectId: z.string(),
    }),
  )
  .output(z.object({ songRequests: z.array(zSongRequestOutput) }))
  .query(async ({ ctx, input }) => {
    const project = await ctx.prisma.projectSubmission.findFirst({
      where: {
        projectId: input.projectId,
      },
      include: {
        songRequests: true,
      },
    });

    if (!project) {
      throw new TRPCError({ message: "Project not found.", code: "NOT_FOUND" });
    }

    if (
      ctx.session.user.role !== "ADMIN" &&
      project.projectOwnerId !== ctx.session.user.userId
    ) {
      throw new TRPCError({ message: "Project not found.", code: "FORBIDDEN" });
    }

    const songRequests = project.songRequests;
    return { songRequests };
  });

//gets the information about a specific songRequest in a mediamaker's project
export const songRequestProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .input(
    z.object({
      projectId: z.string(),
      songRequestId: z.string(),
    }),
  )
  .output(
    zSongRequestOutput.extend({
      projectSubmission: z.object({ projectOwnerId: z.string() }),
    }),
  )
  .query(async ({ ctx, input }) => {
    const songRequestData = await ctx.prisma.songRequest.findFirst({
      where: {
        songRequestId: input.songRequestId,
        projectId: input.projectId,
      },
      include: {
        projectSubmission: {
          select: {
            projectOwnerId: true,
          },
        },
      },
    });

    if (!songRequestData) {
      throw new TRPCError({
        message: "SongRequest not found.",
        code: "NOT_FOUND",
      });
    }

    if (
      ctx.session.user.role !== "ADMIN" &&
      songRequestData.projectSubmission.projectOwnerId !==
        ctx.session.user.userId
    ) {
      throw new TRPCError({
        message: "SongRequest not found.",
        code: "FORBIDDEN",
      });
    }

    return songRequestData;
  });
