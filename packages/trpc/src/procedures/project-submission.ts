import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const projectSubmissionProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "write",
)
  .input(
    z.object({
      projectTitle: z.string(),
      description: z.string(),
      scenes: z.array(
        z.object({
          sceneTitle: z.string(),
          description: z.string(),
          musicType: z.string(),
          similarSongs: z.string().optional(),
          additionalInfo: z.string().optional(),
        }),
      ),
      deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
      videoLink: z.string().optional(),
      additionalInfo: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Create the project submission
    await ctx.prisma.projectSubmission.create({
      data: {
        projectOwner: {
          connect: { userId: ctx.session.user.userId },
        },
        projectTitle: input.projectTitle,
        description: input.description,
        scenes: {
          create: input.scenes.map((scene) => ({
            sceneTitle: scene.sceneTitle,
            description: scene.description,
            musicType: scene.musicType,
            similarSongs: scene.similarSongs,
            additionalInfo: scene.additionalInfo,
          })),
        },
        deadline: new Date(input.deadline),
        videoLink: input.videoLink,
        additionalInfo: input.additionalInfo,
      },
      include: {
        scenes: true,
      },
    });

    return {
      message: "Project submission created successfully",
    };
  });
