import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Role } from "@good-dog/db";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

export const submitMusicProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      groupId: z.string(),
      songName: z.string(),
      songLink: z.string().url(),
      genre: z.string(),
      songwriters: z.array(
        z.object({
          email: z.string(),
        }),
      ),
      additionalInfo: z.string().optional(),
    }),
  )

  .mutation(async ({ ctx, input }) => {
    // Check if the user is a Musician or an Admin
    if (
      ctx.session.user.role !== Role.MUSICIAN &&
      ctx.session.user.role !== Role.ADMIN
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only musicians can submit music",
      });
    }

    // Create the music submission
    const musicSubmission = await ctx.prisma.musicSubmission.create({
      data: {
        artist: {
          connect: { userId: ctx.session.userId },
        },
        group: {
          connect: {
            groupId: input.groupId,
          },
        },
        songName: input.songName,
        songLink: input.songLink,
        genre: input.genre,
        songwriters: {
          connect: input.songwriters.map((_songwriter) => ({
            groupId_email: {
              groupId: input.groupId,
              email: _songwriter.email,
            },
          })),
        },
        additionalInfo: input.additionalInfo ?? "",
      },
    });

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
