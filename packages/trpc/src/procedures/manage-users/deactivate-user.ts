import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";

import { zMessageOutput } from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";

export const deactivateUserProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "modify",
)
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .output(zMessageOutput)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        userId: input.userId,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User does not exist",
      });
    }

    await ctx.prisma.user.update({
      where: {
        userId: input.userId,
      },
      data: {
        active: false,
      },
    });

    return {
      message: "User successfully deactivated.",
    };
  });
