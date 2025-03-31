import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

//TODO: CHANGE BACK TO PROJECT AND REPERTOIRE PERMISSIONS AFTER TESTING
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

// TODO: test these procedures

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

    if (
      !project ||
      (ctx.session.user.role === "MEDIA_MAKER" &&
        project.projectOwnerId !== ctx.session.user.userId)
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
    const projectOwnerId = await ctx.prisma.projectSubmission.findFirst({
      where: {
        projectId: input.projectId,
      },
      select: {
        projectOwnerId: true,
      },
    });

    if (
      !projectOwnerId ||
      (ctx.session.user.role === "MEDIA_MAKER" &&
        projectOwnerId.projectOwnerId !== ctx.session.user.userId)
    ) {
      throw new TRPCError({ message: "Project not found.", code: "FORBIDDEN" });
    }

    const scene = await ctx.prisma.sceneSubmission.findFirst({
      where: {
        sceneId: input.sceneId,
        projectId: input.projectId,
      },
    });

    if (!scene) {
      throw new TRPCError({ message: "Scene not found.", code: "FORBIDDEN" });
    }

    return scene;
  });
