import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import {
  publicCommentSelect,
  publicMusicContributorSelect,
  publicMusicSubmissionFullSelect,
  publicMatchSelect,
  publicProjectFullSelect,
  publicProjectSummarySelect,
  publicSongRequestFullSelect,
  publicUserSummarySelect,
} from "../dtos";

export const getProjectSongRequestsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const projectsRaw = await ctx.prisma.projectSubmission.findMany({
    select: {
      ...publicProjectFullSelect,
      songRequests: { select: publicSongRequestFullSelect },
      projectOwner: { select: publicUserSummarySelect },
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
  rolePermissionsProcedureBuilder(mediaMakerOnlyPermissions, "read")
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
        select: {
          ...publicSongRequestFullSelect,
          projectSubmission: {
            select: {
              ...publicProjectFullSelect,
              projectManager: { select: publicUserSummarySelect },
              projectOwner: { select: publicUserSummarySelect },
            },
          },
          matches: {
            select: {
              ...publicMatchSelect,
              musicSubmission: {
                select: {
                  ...publicMusicSubmissionFullSelect,
                  contributors: { select: publicMusicContributorSelect },
                  submitter: { select: publicUserSummarySelect },
                },
              },
            },
          },
          comments: {
            select: {
              ...publicCommentSelect,
              user: { select: publicUserSummarySelect },
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
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    where: {
      projectOwnerId: ctx.session.user.userId,
    },
    select: {
      ...publicProjectFullSelect,
      songRequests: { select: publicSongRequestFullSelect },
      projectOwner: { select: publicUserSummarySelect },
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
    select: publicProjectSummarySelect,
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
      select: {
        projectOwnerId: true,
        songRequests: { select: publicSongRequestFullSelect },
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
      select: {
        ...publicSongRequestFullSelect,
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
