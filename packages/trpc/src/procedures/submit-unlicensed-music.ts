import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const submitUnlicensedMusicProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "write",
)
  .input(
    z.object({
      songName: z.string(),
      artist: z.string(),
      songLink: z.string().url(),
      genre: z.string(),
      additionalInfo: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Create the music submission
    await ctx.prisma.unlicensedMusicSubmission.create({
      data: {
        songName: input.songName,
        artist: input.artist,
        songLink: input.songLink,
        genre: input.genre,
        additionalInfo: input.additionalInfo,
      },
    });

    //Proceed with music submission
    return {
      message: "Unlicensed Music submitted successfully",
    };
  });
