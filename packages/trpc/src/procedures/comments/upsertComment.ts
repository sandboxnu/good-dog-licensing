import { TRPCError } from "@trpc/server";
import z from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { sendEmailHelper } from "../../utils";
import { publicUserSummarySelect } from "../../dtos";

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

      const songRequest = await ctx.prisma.songRequest.findUnique({
        where: { songRequestId: input.songRequestId },
        select: {
          songRequestId: true,
          projectSubmission: {
            select: {
              projectTitle: true,
              projectOwner: { select: publicUserSummarySelect },
              projectManager: { select: publicUserSummarySelect },
            },
          },
        },
      });

      if (!songRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Song Request not found.",
        });
      }

      await sendEmailHelper(
        async () =>
          ctx.session.user.role == "MEDIA_MAKER"
            ? await ctx.emailService.sendAdminAndPMChatMessage(
                songRequest.projectSubmission.projectTitle,
                songRequest.songRequestId,
                songRequest.projectSubmission.projectManager?.email,
              )
            : await ctx.emailService.sendMediaMakerChatMessage(
                songRequest.projectSubmission.projectOwner.email,
                songRequest.projectSubmission.projectTitle,
                songRequest.songRequestId,
              ),
        "Email failed to send",
      );

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
