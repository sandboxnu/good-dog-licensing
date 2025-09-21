import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import { zMusicSubmissionValues } from "../schema";

export const submitMusicProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "submit",
)
  .input(zMusicSubmissionValues)
  .mutation(async ({ ctx, input }) => {
    // Create the music submission
    const musicSubmission = await ctx.prisma.musicSubmission.create({
      data: {
        artist: {
          connect: { userId: ctx.session.user.userId },
        },
        songName: input.songName,
        songLink: input.songLink,
        genre: input.genre.join(", "),
        additionalInfo: input.additionalInfo ?? "",
      },
    });

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
