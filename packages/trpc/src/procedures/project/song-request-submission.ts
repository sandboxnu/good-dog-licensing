import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zSongRequest } from "../../schema";
import z from "zod";

export const songRequestSubmissionProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "submit",
)
  .input(
    z.object({
      projectId: z.string(),
      songRequest: zSongRequest,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.prisma.projectSubmission.findFirst({
      where: {
        projectId: input.projectId,
        projectOwnerId: ctx.session.user.userId,
      },
    });

    if (!project) {
      throw new Error("Project not found or you don't have permission");
    }

    // Create the song request submission
    await ctx.prisma.songRequest.create({
      data: {
        projectSubmission: {
          connect: project,
        },
        description: input.songRequest.description,
        feelingsConveyed: input.songRequest.feelingsConveyed,
        similarSongs: input.songRequest.similarSongs,
        additionalInfo: input.songRequest.additionalInfo,
      },
    });

    return {
      message: "Song request submission created successfully",
    };
  });
