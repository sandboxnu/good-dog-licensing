import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

// gets all the matches for this scene, along with their music, and ratings
// TODO: test this procedure as mentioned in #152
export const mediamakerMatchesProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions, // LAUREN - todo: if changing the return tupe of this, need to check where it's called
  "read", // and change client's expectataion
)
  .input(
    z.object({
      projectId: z.string(),
      sceneId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const scene = await ctx.prisma.sceneSubmission.findFirst({
      where: {
        projectId: input.projectId,
        sceneId: input.sceneId,
      },
      include: {
        suggestedMatches: {
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
            matchLikes: true,
          },
        },
        projectSubmission: true,
      },
    });

    if (!scene) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Scene not found." });
    }

    if (
      ctx.session.user.role !== "ADMIN" &&
      scene.projectSubmission.projectOwnerId !== ctx.session.user.userId
    ) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Scene not found." });
    }

    const matches = scene.suggestedMatches;

    return {
      matches: matches,
    };
  });
