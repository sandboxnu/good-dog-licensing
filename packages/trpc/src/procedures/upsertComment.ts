import z from "zod";
import { TRPCError } from "@trpc/server";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

const CommentsSchema = z.object({
  commentText: z.string(),
  userId: z.string(),
});

export const upsertCommentsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "modify",
)
  .input(
    z.object({
      comment: CommentsSchema,
      songRequestId: z.string(),
      commentId: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (ctx.session.user.userId === input.comment.userId) {
      if (input.commentId) {
        await ctx.prisma.comments.update({
          where: {
            commentId: input.commentId,
            userId: input.comment.userId,
          },
          data: {
            commentText: input.comment.commentText,
          },
        });
      } else {
        await ctx.prisma.comments.create({
          data: {
            commentText: input.comment.commentText,
            songRequestId: input.songRequestId,
            userId: input.comment.userId,
          },
        });
      }
      return {
        message: "Comments successfully updated.",
      };
    } else {
      throw new TRPCError({
        message: "You are not authorized to update this comment.",
        code: "FORBIDDEN",
      });
    }
  });
