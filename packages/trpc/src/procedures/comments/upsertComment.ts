import { TRPCError } from "@trpc/server";
import z from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { sendEmailHelper } from "../../utils";

export const upsertCommentsProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "submit",
)
  .input(
    z.object({
      commentText: z.string().min(1),
      songRequestId: z.string(),
      commentId: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.userId;

    if (input.commentId) {
      await ctx.prisma.comments.update({
        where: {
          commentId: input.commentId,
          userId,
        },
        data: {
          commentText: input.commentText,
        },
      });
    } else {
      await ctx.prisma.comments.create({
        data: {
          commentText: input.commentText,
          songRequestId: input.songRequestId,
          userId,
        },
      });
    }

    const songRequest = await ctx.prisma.songRequest.findUnique({
      where: { songRequestId: input.songRequestId },
      include: {
        projectSubmission: {
          include: {
            projectOwner: true,
            projectManager: true,
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
  });
