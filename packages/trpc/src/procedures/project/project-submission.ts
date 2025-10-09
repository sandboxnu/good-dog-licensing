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
            oneLineSummary: songRequest.oneLineSummary,
            description: songRequest.description,
            musicType: songRequest.musicType,
            similarSongs: songRequest.similarSongs,
            additionalInfo: songRequest.additionalInfo,
          })),
        },
        deadline: new Date(input.deadline),
        videoLink: input.videoLink,
        additionalInfo: input.additionalInfo,
      },
      include: {
        songRequests: true,
      },
    });

    // Send email to internal users that the project was created
    const sendEmailCallback = async () =>
      await ctx.emailService.notifyInternalUsersNewProjectSubmitted(
        newProjectSubmission.projectId,
      );
    await sendEmailHelper(sendEmailCallback, "Email failed to send");

    return {
      message: "Project submission created successfully",
    };
  });
