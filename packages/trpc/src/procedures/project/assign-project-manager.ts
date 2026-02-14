import { adminPagePermissions } from "@good-dog/auth/permissions";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const assignProjectManagerProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "modify",
)
  .input(
    z.object({
      projectId: z.string(),
      projectManagerId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const projectManager = await ctx.prisma.user.findUnique({
      where: { userId: input.projectManagerId },
    });

    if (!projectManager) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project manager id not found.",
      });
    }

    if (!projectManager.active) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Project manager must be active.",
      });
    }

    if (
      projectManager.role !== "ADMIN" &&
      projectManager.role !== "MODERATOR"
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Project manager must be an admin or moderator.",
      });
    }

    await ctx.prisma.projectSubmission.update({
      where: {
        projectId: input.projectId,
      },
      data: {
        projectManagerId: input.projectManagerId,
      },
    });

    return {
      message: "Project manager successfully assigned.",
    };
  });
