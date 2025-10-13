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
    await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: MatchState.NEW,
      },
    });

    return {
      message: "Match successfully created.",
    };
  });
