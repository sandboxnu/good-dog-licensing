import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

import { TRPCError } from "@trpc/server";

export const deleteMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(
    z.object({
      musicId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.match.deleteMany({
        where: {
          musicId: input.musicId,
        },
      });

      return {
        message: "Match successfully deleted.",
      };
    } catch (error) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.musicId}`,
      });
    }
  });
