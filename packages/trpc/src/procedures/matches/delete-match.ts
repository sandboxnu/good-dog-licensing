import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

export const deleteMatchProcedure = rolePermissionsProcedureBuilder(
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
    try {
      await ctx.prisma.match.delete({
        where: {
          songRequestId_musicId: {
            songRequestId: input.songRequestId,
            musicId: input.musicId,
          },
        },
      });

      return {
        message: "Match successfully deleted.",
      };
    } catch (error) {
      throw new Error(
        "Failed to delete match. Error: " + (error as Error).message,
      );
    }
  });
