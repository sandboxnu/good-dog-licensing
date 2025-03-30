import { z } from "zod";

import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const submitMusicProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "submit",
)
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
    // Create the music submission
    const musicSubmission = await ctx.prisma.musicSubmission.create({
      data: {
        artist: {
          connect: { userId: ctx.session.user.userId },
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
