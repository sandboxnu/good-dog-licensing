import { TRPCError } from "@trpc/server";
import z from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { zMessageOutput } from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zSongRequest } from "../../schema";

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
  .output(zMessageOutput)
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.prisma.projectSubmission.findFirst({
      where: {
        projectId: input.projectId,
        projectOwnerId: ctx.session.user.userId,
      },
    });

    if (!project) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Project not found or you don't have permission",
      });
    }

    // Create the song request submission
    await ctx.prisma.songRequest.create({
      data: {
        projectSubmission: {
          connect: project,
        },
        songRequestTitle: input.songRequest.songRequestTitle,
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
