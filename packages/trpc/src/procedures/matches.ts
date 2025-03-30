import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminPagePermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";
import { MatchState } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

const MatchCommentsSchema = z.object({
  commentText: z.string(),
  userId: z.string(),
});

export const createUpdateMatchCommentsProcedure =
  rolePermissionsProcedureBuilder(projectAndRepertoirePagePermissions, "write")
    .input(
      z.object({
        matchComment: MatchCommentsSchema,
        matchId: z.string(),
        unlicensed: z.boolean(),
        commentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userId === input.matchComment.userId) {
        if (input.commentId) {
          await ctx.prisma.matchComments.update({
            where: {
              commentId: input.commentId,
              userId: input.matchComment.userId,
            },
            data: {
              commentText: input.matchComment.commentText,
            },
          });
        } else {
          if (input.unlicensed) {
            await ctx.prisma.matchComments.create({
              data: {
                commentText: input.matchComment.commentText,
                unlicensedSuggestedMatchId: input.matchId,
                userId: input.matchComment.userId,
              },
            });
          } else {
            await ctx.prisma.matchComments.create({
              data: {
                commentText: input.matchComment.commentText,
                suggestedMatchId: input.matchId,
                userId: input.matchComment.userId,
              },
            });
          }
        }
        return {
          message: "Comments successfully updated.",
        };
      } else {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    });

export const suggestedMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "write",
)
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
        where: { suggestedMatchId: input.matchId },
        select: { matcherUserId: true },
      });

      if (!match) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Match not found.",
        });
      }
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
          matcherUserId: ctx.session.user.userId,
          description: input.description,
          matchState: MatchState.PENDING,
        },
      });
    }

    return {
      message: "Match successfully suggested.",
    };
  });

export const reviewSuggestedMatchProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "write",
)
  .input(
    z.object({
      matchId: z.string(),
      matchState: z.nativeEnum(MatchState),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.suggestedMatch.update({
      where: {
        suggestedMatchId: input.matchId,
      },
      data: {
        matchState: input.matchState,
        reviewerId: ctx.session.user.userId,
      },
    });
  });

export const getMatchesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .input(
    z.object({
      matchState: z.nativeEnum(MatchState),
    }),
  )
  .query(async ({ ctx, input }) => {
    const matches = await ctx.prisma.suggestedMatch.findMany({
      where: {
        matchState: input.matchState,
      },
    });
    return { matches };
  });
