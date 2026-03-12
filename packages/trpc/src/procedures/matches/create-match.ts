import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";
import { MatchState, Status } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { updateStatuses } from "../../utils/status/update-status";

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
    // Create match
    const createdMatch = await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: MatchState.WAITING_FOR_MANAGER_APPROVAL,
        adminStatus: Status.SUGGESTIONS_NEEDED,
        mediaMakerStatus: Status.HIDDEN,
        musicianStatus: Status.HIDDEN,
      },
      include: {
        songRequest: true,
      },
    });

    // Update statuses of match, SR, and project
    await updateStatuses(
      createdMatch.songRequest.projectId,
      createdMatch.songRequestId,
      createdMatch.matchId,
    );

    return {
      message: "Match successfully created.",
    };
  });
