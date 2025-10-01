import z from "zod";
import { TRPCError } from "@trpc/server";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

const CommentsSchema = z.object({
  commentText: z.string(),
  userId: z.string(),
});

export const upsertCommentsProcedure =
  rolePermissionsProcedureBuilder(mediaMakerOnlyPermissions, "modify")
    .input(
      z.object({
        comment: CommentsSchema,
        sceneId: z.string(),
        commentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.userId === input.comment.userId) {
       await ctx.prisma.comments.upsert({
          where: {
            commentId: input.commentId ?? "",
            userId: input.comment.userId,
          },
          update: {
            commentText: input.comment.commentText,
          },
          create: {
            commentText: input.comment.commentText,
            sceneId: input.sceneId,
            userId: input.comment.userId,
          },
       })
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