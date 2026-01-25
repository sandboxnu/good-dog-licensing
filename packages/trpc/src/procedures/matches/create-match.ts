import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";
import { MatchState } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

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
    const project = await ctx.prisma.projectSubmission.findFirst({
      where: {
        songRequests: {
          some: {
            songRequestId: input.songRequestId,
          },
        },
      },
    });

    // if user is the project manager, set to SENT_TO_MEDIA_MAKER, else WAITING_FOR_MANAGER_APPROVAL
    const matchStateToUse =
      project?.projectManagerId &&
      project.projectManagerId === ctx.session.user.userId
        ? MatchState.SENT_TO_MEDIA_MAKER
        : MatchState.WAITING_FOR_MANAGER_APPROVAL;

    await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: matchStateToUse,
      },
    });

    return {
      message: "Match successfully created.",
    };
  });
