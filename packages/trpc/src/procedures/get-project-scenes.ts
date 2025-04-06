import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectScenesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const projectsRaw = await ctx.prisma.projectSubmission.findMany({
    include: {
      scenes: true,
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

export const getProjectSceneByIdProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .input(
    z.object({
      sceneId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const scene = await ctx.prisma.sceneSubmission.findUnique({
      where: {
        sceneId: input.sceneId,
      },
      include: {
        unlicensedSuggestedMatches: {
          include: {
            matchComments: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            musicSubmission: true,
          },
        },
        suggestedMatches: {
          include: {
            matchComments: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            musicSubmission: {
              include: {
                artist: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                songwriters: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!scene) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Project Scene ID was not found.`,
      });
    }

    const project = await ctx.prisma.projectSubmission.findUnique({
      where: {
        projectId: scene.projectId,
      },
    });

    if (!project) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    const sceneFinal = {
      ...scene,
      unlicensedSuggestedMatches: scene.unlicensedSuggestedMatches.map(
        (match) => {
          return {
            ...match,
            matchComments: match.matchComments.map((comment) => {
              return {
                ...comment,
                createdAtDateString: comment.createdAt.toDateString(),
              };
            }),
          };
        },
      ),
      suggestedMatches: scene.suggestedMatches.map((match) => {
        return {
          ...match,
          matchComments: match.matchComments.map((comment) => {
            return {
              ...comment,
              createdAtDateString: comment.createdAt.toDateString(),
            };
          }),
        };
      }),
    };

    return { projectTitle: project.projectTitle, ...sceneFinal };
  });

export const getUserProjectScenesProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    where: {
      projectOwnerId: ctx.session.user.userId,
    },
    include: {
      scenes: true,
      projectOwner: true,
    },
  });
  return { projects };
});
