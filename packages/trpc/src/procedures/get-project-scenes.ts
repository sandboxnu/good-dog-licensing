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
  const projects = await ctx.prisma.projectSubmission.findMany({
    include: {
      scenes: true,
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

//gets all of the scenes belonging to a project for a mediamaker
export const mediamakerScenesProcedure = rolePermissionsProcedureBuilder(
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
        scenes: true,
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

    const scenes = project.scenes;
    return { scenes };
  });

//gets the information about a specific scene in a mediamaker's project
export const sceneProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .input(
    z.object({
      projectId: z.string(),
      sceneId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const sceneData = await ctx.prisma.sceneSubmission.findFirst({
      where: {
        sceneId: input.sceneId,
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

    if (!sceneData) {
      throw new TRPCError({ message: "Scene not found.", code: "NOT_FOUND" });
    }

    if (
      ctx.session.user.role !== "ADMIN" &&
      sceneData.projectSubmission.projectOwnerId !== ctx.session.user.userId
    ) {
      throw new TRPCError({ message: "Scene not found.", code: "FORBIDDEN" });
    }

    return sceneData;
  });
