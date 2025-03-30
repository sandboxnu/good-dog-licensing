import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { MatchState } from "@good-dog/db";

import { adminOrModeratorAuthenticatedProcedureBuilder } from "../middleware/moderator-admin-authenticated";

export const unlicensedSuggestedMatchProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        matchId: z.string().optional(), // If provided, update; otherwise, create
        projectId: z.string().optional(), // Required for creation
        sceneId: z.string().optional(), // Required for creation
        musicId: z.string().optional(), // Required for creation
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //update a match -- only in the case of editing description
      if (input.matchId) {
        const match = await ctx.prisma.unlicensedSuggestedMatch.findUnique({
          where: { unlicensedSuggestedMatchId: input.matchId },
          select: { matcherUserId: true },
        });

        if (!match) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Match not found.",
          });
        }

        if (ctx.session.userId !== match.matcherUserId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not authorized to update this match.",
          });
        }

        await ctx.prisma.unlicensedSuggestedMatch.update({
          where: { unlicensedSuggestedMatchId: input.matchId },
          data: { description: input.description },
        });

        return {
          message: "Match successfully updated.",
        };
      } else {
        //create new match
        if (!input.projectId || !input.sceneId || !input.musicId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing required fields for creating a match.",
          });
        }

        await ctx.prisma.unlicensedSuggestedMatch.create({
          data: {
            projectId: input.projectId,
            sceneId: input.sceneId,
            musicId: input.musicId,
            matcherUserId: ctx.session.userId,
            description: input.description,
            matchState: MatchState.PENDING,
          },
        });
        return {
          message: "Match successfully suggested.",
        };
      }
    });

//updating the match state based on mediamaker response
export const updateUnlicensedMatchState =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        unlicensedSuggestedMatchId: z.string(),
        matchState: z.nativeEnum(MatchState),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const match = await ctx.prisma.unlicensedSuggestedMatch.findUnique({
        where: { unlicensedSuggestedMatchId: input.unlicensedSuggestedMatchId },
        select: { matcherUserId: true, projectSubmission: true },
      });

      if (!match) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Match not found.",
        });
      }

      if (ctx.session.user.role === match.projectSubmission.projectOwnerId) {
        await ctx.prisma.unlicensedSuggestedMatch.update({
          where: {
            unlicensedSuggestedMatchId: input.unlicensedSuggestedMatchId,
          },
          data: {
            matchState: input.matchState,
          },
        });
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access Denied.",
        });
      }
    });
