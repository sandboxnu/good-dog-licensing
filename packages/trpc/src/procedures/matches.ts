import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminOrModeratorAuthenticatedProcedureBuilder } from "../internal/init";

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

export const createSuggestedMatchProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        projectId: z.string(),
        sceneId: z.string(),
        musicId: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.suggestedMatch.create({
        data: {
          projectId: input.projectId,
          sceneId: input.sceneId,
          musicId: input.musicId,
          matcherUserId: ctx.session.userId,
          description: input.description,
        },
      });
    });

export const approveSuggestedMatchProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.suggestedMatch.update({
        where: {
          matchId: input.matchId,
        },
        data: {
          approved: true,
          approvedMatch: {
            create: {
              approverUserId: ctx.session.userId,
            },
          },
        },
      });
    });

export const updateSuggestedMatchProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        description: z.string(),
        matchId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = await ctx.prisma.suggestedMatch.findUnique({
        where: {
          matchId: input.matchId,
        },
        select: {
          matcherUserId: true,
        },
      });
      if (ctx.session.userId === userId?.matcherUserId) {
        await ctx.prisma.suggestedMatch.update({
          where: {
            matchId: input.matchId,
          },
          data: {
            description: input.description,
          },
        });
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    });
