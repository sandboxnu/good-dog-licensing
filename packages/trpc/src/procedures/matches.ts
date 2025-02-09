import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { MatchState } from "@good-dog/db";

import {
  adminAuthenticatedProcedureBuilder,
  adminOrModeratorAuthenticatedProcedureBuilder,
} from "../internal/init";

const MatchCommentsSchema = z.object({
  matchId: z.string(),
  commentId: z.string().optional(),
  commentText: z.string(),
  userId: z.string(),
});

export const createUpdateMatchCommentsProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        matchComment: MatchCommentsSchema,
        matchUserId: z.string(),
        matchId: z.string(),
        commentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.userId === input.matchComment.userId) {
        await ctx.prisma.matchComments.upsert({
          where: {
            commentId: input.commentId,
          },
          update: {
            commentText: input.matchComment.commentText,
          },
          create: {
            commentText: input.matchComment.commentText,
            matchId: input.matchId,
            userId: input.matchComment.userId,
          },
        });
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    });

export const suggestedMatchProcedure =
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
        const match = await ctx.prisma.suggestedMatch.findUnique({
          where: { matchId: input.matchId },
          select: { matcherUserId: true },
        });

        if (!match) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Match not found.",
          });
        }

        if (ctx.session.userId !== match.matcherUserId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Not authorized to update this match.",
          });
        }

        await ctx.prisma.suggestedMatch.update({
          where: { matchId: input.matchId },
          data: { description: input.description },
        });
      } else {
        //create new match
        if (!input.projectId || !input.sceneId || !input.musicId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing required fields for creating a match.",
          });
        }

        await ctx.prisma.suggestedMatch.create({
          data: {
            projectId: input.projectId,
            sceneId: input.sceneId,
            musicId: input.musicId,
            matcherUserId: ctx.session.userId,
            description: input.description,
            matchState: MatchState.PENDING,
          },
        });
      }
    });

export const reviewSuggestedMatchProcedure = adminAuthenticatedProcedureBuilder
  .input(
    z.object({
      matchId: z.string(),
      matchState: z.nativeEnum(MatchState),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.suggestedMatch.update({
      where: {
        matchId: input.matchId,
      },
      data: {
        matchState: input.matchState,
        reviewerId: ctx.session.userId,
      },
    });
  });

export const getMatchesScenesProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        matchState: z.nativeEnum(MatchState),
      }),
    )
    .mutation(async({ ctx, input }));
