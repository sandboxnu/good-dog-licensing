import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import { zProjectSubmissionValues } from "../schema";

export const projectSubmissionProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "submit",
)
  .input(zProjectSubmissionValues)
  .mutation(async ({ ctx, input }) => {
    // Create the project submission
    await ctx.prisma.projectSubmission.create({
      data: {
        projectOwner: {
          connect: { userId: ctx.session.user.userId },
        },
        projectTitle: input.projectTitle,
        description: input.description,
        songRequests: {
          create: input.songRequests.map((songRequest) => ({
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

    return {
      message: "Project submission created successfully",
    };
  });
