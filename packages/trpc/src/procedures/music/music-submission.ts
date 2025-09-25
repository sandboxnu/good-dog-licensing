import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";
import { z } from "zod";

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
    // Creates a contributor for the submitter to be added to the music submission's list of contributors
    const submitterAsContributor = {
      name: ctx.session.user.firstName
        .concat(" ")
        .concat(ctx.session.user.lastName),
      roles: input.submitterRoles,
      affiliation: input.submitterAffiliation,
      ipi: input.submitterIpi,
    };

    // If the submitter is a songwriter or a lyricist, and if the submitted ipi is not null, then update the submitter's ipi
    if ((input.submitterRoles.includes("SONGWRITER") || input.submitterRoles.includes("LYRICIST")) && input.submitterIpi != null) {
      await ctx.prisma.user.update({
        where: {
          userId: ctx.session.user.userId
        },
        data: {
          ipi: input.submitterIpi
        }
      });
    }

    // Update/Set this submitters affiliation
    await ctx.prisma.user.update({
      where: {
        userId: ctx.session.user.userId
      },
      data: {
        affiliation: input.submitterAffiliation
      }
    })

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
        contributors: {
          create: input.contributors.concat(submitterAsContributor),
        },
      },
    });

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
