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

// TODO: test these two procedures
export const mediamakerProjectsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    where: {
      projectOwnerId: ctx.session.user.userId,
    },
    include: {
      
    }
  });
  return { projects };
});

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

    if (!project || project.projectOwnerId !== ctx.session.user.userId) {
      throw new TRPCError({ message: "Project not found.", code: "FORBIDDEN" });
    }

    const scenes = project.scenes;
    return { scenes };
  });
