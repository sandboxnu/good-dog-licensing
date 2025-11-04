import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

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
    await ctx.prisma.match.deleteMany({
      where: {
        musicId: input.matchId,
      },
    });

    return {
      message: "Match successfully deleted.",
    };
  });
