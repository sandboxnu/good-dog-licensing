import { z } from "zod";

import { adminOrModeratorAuthenticatedProcedureBuilder } from "../internal/init";

const MatchCommentsSchema = z.object({
  matchId: z.string().optional(),
  commentId: z.string().optional(),
  commentText: z.string(),
  userId: z.string(),
});

//create a new suggested match
//add comments to a suggested match
//create an approved match

export const suggestMatchesProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder
    .input(
      z.object({
        sceneId: z.string(),
        musicId: z.string(),
        matchComments: z.array(MatchCommentsSchema),
        matchUserId: z.string(),
        approved: z.boolean(),
        approvedMatchId: z.string().optional(),
        approveUserId: z.string().optional(),
        matchId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if there is already an suggested match for the given scenes and music
      const existingMatch = await ctx.prisma.suggestedMatch.findUnique({
        where: {
          matchId: input.matchId,
          sceneId: input.sceneId,
          musicId: input.musicId,
        },
      });

      if (existingMatch) {
        const newComments = await Promise.all(
          input.matchComments.map(async (comment) => {
            if (!comment.commentId) {
              const commentUser = ctx.prisma.user.findUnique({
                where: {
                  userId: comment.userId,
                },
              });

              const commentMatch = ctx.prisma.suggestedMatch.findUnique({
                where: {
                  matchId: comment.matchId,
                },
              });

              return {
                comment: comment,
                commentUser: commentUser,
                commentMatch: commentMatch,
              };
            }
          }),
        );

        if (newComments.length > 0) {
          ctx.prisma.suggestedMatch.update({
            data: {
              matchComments: {
                createMany: {
                  data: newComments.map((com) => ({
                    commentText: com.comment.commentText,
                    userId: com.comment?.userId,
                    user: com.commentUser,
                    matchId: com.comment?.matchId,
                    match: com.commentMatch,
                  })),
                },
              },
            },
            where: {
              matchId: input.matchId,
            },
          });
        }
      }

      //creating a new match
    });
