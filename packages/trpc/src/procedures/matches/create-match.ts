import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";
import { MatchState } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { sendEmailHelper } from "../../utils";
import { TRPCError } from "@trpc/server";

export const createMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(
    z.object({
      songRequestId: z.string(),
      musicId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: MatchState.WAITING_FOR_MANAGER_APPROVAL,
      },
    });

    const songRequest = await ctx.prisma.songRequest.findUnique({
      where: { songRequestId: input.songRequestId },
      include: { projectSubmission: { include: { projectManager: true } } },
    });

    if (!songRequest) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Song Request not found.",
      });
    }

    const music = await ctx.prisma.musicSubmission.findUnique({
      where: { musicId: input.musicId },
    });

    if (!music) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Music not found.",
      });
    }

    const projectManager = songRequest.projectSubmission.projectManager;
    if (projectManager) {
      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendPMSongSuggestionAddedToBrief(
            projectManager.email,
            ctx.session.user.firstName + ctx.session.user.lastName,
            music.songName,
            music.performerName,
            songRequest.projectSubmission.projectTitle,
            songRequest.projectSubmission.projectId,
          ),
        "Email failed to send",
      );
    }

    return {
      message: "Match successfully created.",
    };
  });
