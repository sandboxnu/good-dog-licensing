import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { updateStatuses } from "../../utils/status/update-status";

export const deleteMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(
    z.object({
      matchId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // delete the match
    const deletedMatch = await ctx.prisma.match.delete({
      where: {
        matchId: input.matchId,
      },
      include: {
        songRequest: true,
      },
    });

    // update the statuses of project and SR
    await updateStatuses(
      deletedMatch.songRequest.projectId,
      deletedMatch.songRequestId,
      null,
    );

    return {
      message: "Match successfully deleted.",
    };
  });
