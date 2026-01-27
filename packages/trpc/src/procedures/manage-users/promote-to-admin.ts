import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { TRPCError } from "@trpc/server";
import { Role } from "@good-dog/db";

export const promoteToAdminProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "modify",
)
  .input(
    z.object({
      userId: z.string(),
    }),
  )
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

    if (user.role !== "MODERATOR") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only P&R reps can be promoted to admins.",
      });
    }

    await ctx.prisma.user.update({
      where: {
        userId: input.userId,
      },
      data: {
        role: Role.ADMIN,
      },
    });

    return {
      message: "User successfully promoted to admin.",
    };
  });
