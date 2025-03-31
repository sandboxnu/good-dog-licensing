import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

// gets all the licensed and unlicensed matches for this scene, along with their music, and ratings
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
        unlicensedSuggestedMatches: true,
        suggestedMatches: true,
        projectSubmission: true,
      },
    });

    if (scene?.projectSubmission.projectOwnerId !== ctx.session.user.userId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Scene not found." });
    }

    const licensedMatches = scene.suggestedMatches;
    const unlicensedMatches = scene.unlicensedSuggestedMatches;

    const licensedMatchesAndMusic = await Promise.all(
      licensedMatches.map(async (match) => {
        return await ctx.prisma.suggestedMatch.findFirst({
          where: {
            suggestedMatchId: match.suggestedMatchId,
          },
          include: {
            musicSubmission: true,
            matchLikes: true,
          },
        });
      }),
    );

    const unlicensedMatchesAndMusic = await Promise.all(
      unlicensedMatches.map(async (match) => {
        return await ctx.prisma.unlicensedSuggestedMatch.findFirst({
          where: {
            unlicensedSuggestedMatchId: match.unlicensedSuggestedMatchId,
          },
          include: {
            musicSubmission: true,
            matchRatings: true,
          },
        });
      }),
    );

    return {
      licensed: licensedMatchesAndMusic,
      unlicensed: unlicensedMatchesAndMusic,
    };
  });
