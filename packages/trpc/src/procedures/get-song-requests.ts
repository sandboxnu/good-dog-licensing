import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectSongRequestsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
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

// TODO - Test this api route. Ticket #149
export const getProjectSongRequestByIdProcedure =
  rolePermissionsProcedureBuilder(projectAndRepertoirePagePermissions, "read")
    .input(
      z.object({
        songRequestId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const songRequest = await ctx.prisma.songRequest.findUnique({
        where: {
          songRequestId: input.songRequestId,
        },
        include: {
          projectSubmission: true,
          matches: {
            include: {
              musicSubmission: {
                include: {
                  submitter: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
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

      return songRequest;
    });

export const getUserSongRequestsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
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
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    where: {
      projectOwnerId: ctx.session.user.userId,
    },
    include: {},
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
