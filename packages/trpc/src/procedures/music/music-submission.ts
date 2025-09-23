import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";

// Make sure to create Contributor for each person in contributors + a contributor for the submitter
// Make sure to update the submitter's USER table with the affliation and ipi. IF ipi is blank, undefined, or null, don't update..
// affliation will always be updated.
// Validation checks: if they have a NONE music affliation, then they should not have an IPI.
// Everything else should just map to correpsonding fields.

export const submitMusicProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "submit",
)
  .input(zMusicSubmissionValues)
  .mutation(async ({ ctx, input }) => {
    // Create the music submission
    const musicSubmission = await ctx.prisma.musicSubmission.create({
      data: {
        submitter: {
          connect: { userId: ctx.session.user.userId },
        },
        songName: input.songName,
        songLink: input.songLink,
        genre: input.genre.join(", "),
        additionalInfo: input.additionalInfo ?? "",
        performerName: input.performerName,
      },
    });

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
