import { adminPagePermissions } from "@good-dog/auth/permissions";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import z from "zod";
import { TRPCError } from "@trpc/server";
import { sendEmailHelper } from "../../utils";

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

    const project = await ctx.prisma.projectSubmission.findUnique({
      where: { projectId: input.projectId },
      include: { projectOwner: true, projectManager: true },
    });

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    await sendEmailHelper(
      async () =>
        await ctx.emailService.sendMediaMakerProjectManagerAssigned(
          project.projectOwner.email,
          project.projectTitle,
          projectManager.firstName,
        ),
      "Email failed to send",
    );

    await sendEmailHelper(
      async () =>
        await ctx.emailService.sendAdminProjectManagerAssigned(
          ctx.session.user.firstName,
          projectManager.firstName + " " + projectManager.lastName,
          project.projectTitle,
          project.projectId,
        ),
      "Email failed to send",
    );

    return {
      message: "Project manager successfully assigned.",
    };
  });
