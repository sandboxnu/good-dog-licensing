import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectScenesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    include: {
      scenes: true,
      projectOwner: true,
    },
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

    return { projectTitle: project.projectTitle as string, ...scene };
  });
