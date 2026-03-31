import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zProjectSubmissionValues } from "../../schema";
import { sendEmailHelper } from "../../utils";

export const projectSubmissionProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "submit",
)
  .input(zProjectSubmissionValues)
  .mutation(async ({ ctx, input }) => {
    // Create the project submission
    const newProjectSubmission = await ctx.prisma.projectSubmission.create({
      data: {
        projectOwner: {
          connect: { userId: ctx.session.user.userId },
        },
        projectTitle: input.projectTitle,
        description: input.description,
        songRequests: {
          create: input.songRequests.map((songRequest) => ({
            songRequestTitle: songRequest.songRequestTitle,
            description: songRequest.description,
            feelingsConveyed: songRequest.feelingsConveyed,
            similarSongs: songRequest.similarSongs,
            additionalInfo: songRequest.additionalInfo,
          })),
        },
        deadline: new Date(input.deadline),
        videoLink: input.videoLink,
        additionalInfo: input.additionalInfo,
        projectType: input.projectType,
      },
      include: {
        songRequests: true,
      },
    });

    // Send confirmation email to the media maker
    await sendEmailHelper(
      async () =>
        await ctx.emailService.sendMediaMakerBriefSubmissionConfirmation(
          ctx.session.user.email,
        ),
      "Email failed to send",
    );

    // Send email to internal users that the project was created
    await sendEmailHelper(
      async () =>
        await ctx.emailService.sendAdminAndPNRBriefAvailable(
          ctx.session.user.firstName,
          newProjectSubmission.songRequests.length,
          newProjectSubmission.projectTitle,
          newProjectSubmission.projectId,
        ),
      "Email failed to send",
    );

    return {
      message: "Project submission created successfully",
    };
  });
