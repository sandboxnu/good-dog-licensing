import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Role } from "@good-dog/db";

import { authenticatedProcedureBuilder } from "../middleware/authentictated";

export const projectSubmissionProcedure = authenticatedProcedureBuilder
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
    //Ensure user is a media maker or admin
    if (
      ctx.session.user.role !== Role.MEDIA_MAKER &&
      ctx.session.user.role !== Role.ADMIN
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only media makers can submit projects.",
      });
    }

    // Create the project submission
    const projectSubmission = await ctx.prisma.projectSubmission.create({
      data: {
        projectOwner: {
          connect: { userId: ctx.session.userId },
        },
        projectTitle: input.projectTitle,
        description: input.description,
        scenes: {
          create: input.scenes.map((scene) => ({
            sceneTitle: scene.sceneTitle,
            description: scene.description,
            musicType: scene.musicType,
            similarSongs: scene.similarSongs || "",
            additionalInfo: scene.additionalInfo || "",
          })),
        },
        deadline: new Date(input.deadline),
        videoLink: input.videoLink || "",
        additionalInfo: input.additionalInfo || "",
      },
      include: {
        scenes: true,
      },
    });

    return {
      message: "Project submission created successfully",
    };
  });
