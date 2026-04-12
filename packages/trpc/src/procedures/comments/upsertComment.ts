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

    return { message: "Comments successfully updated." };
  });
