import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

// gets all the licensed and unlicensed matches for this scene, along with their music, and ratings
// TODO: test this procedure as mentioned in #152
export const mediamakerMatchesProcedure = rolePermissionsProcedureBuilder(
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
    const scene = await ctx.prisma.sceneSubmission.findFirst({
      where: {
        projectId: input.projectId,
        sceneId: input.sceneId,
      },
      include: {
        unlicensedSuggestedMatches: {
          include: {
            musicSubmission: true,
            matchRatings: true,
          },
        },
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

    const licensedMatches = scene.suggestedMatches;
    const unlicensedMatches = scene.unlicensedSuggestedMatches;

    return {
      licensed: licensedMatches,
      unlicensed: unlicensedMatches,
    };
  });
