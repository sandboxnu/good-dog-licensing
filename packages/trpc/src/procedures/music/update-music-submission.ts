import { TRPCError } from "@trpc/server";
import z from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";

import { zMessageOutput, zMusicSubmissionOutput } from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";

const zUpdateMusicOutput = zMessageOutput.extend({
  musicSubmission: zMusicSubmissionOutput,
});

/**
 * Lets admins and P&R reps correct a song submission on behalf of the musician
 * who sent it in. Unlike {@link submitMusicProcedure} this never writes back to
 * the submitter's profile - staff editing someone else's song should not
 * overwrite that musician's saved IPI or affiliation.
 */
export const updateMusicSubmissionProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(zMusicSubmissionValues.extend({ musicId: z.string() }))
  .output(zUpdateMusicOutput)
  .mutation(async ({ ctx, input }) => {
    const { musicId, contributors, ...values } = input;

    const existing = await ctx.prisma.musicSubmission.findUnique({
      where: { musicId },
      include: { submitter: true },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Music submission ID was not found.`,
      });
    }

    // The submitter is stored as one of the song's contributors, so rebuild it
    // from the submitter fields the same way a new submission would.
    const submitterAsContributor = {
      firstName: existing.submitter.firstName,
      lastName: existing.submitter.lastName,
      roles: values.submitterRoles,
      affiliation: values.submitterAffiliation,
      ipi: values.submitterIpi,
      publisher: values.submitterPublisher,
      publisherIpi: values.submitterPublisherIpi,
      isSubmitter: true,
      email: existing.submitter.email,
    };

    const [_, musicSubmission] = await ctx.prisma.$transaction([
      // Contributors have no stable identity in the form, so replace the whole
      // set. Signed contracts keep their own copy of these details.
      ctx.prisma.musicContributor.deleteMany({
        where: { musicSubmissionId: musicId },
      }),
      ctx.prisma.musicSubmission.update({
        where: { musicId },
        data: {
          songName: values.songName,
          songLink: values.songLink,
          genres: values.genres,
          additionalInfo: values.additionalInfo ?? "",
          songLyrics: values.songLyrics,
          performerName: values.performerName,
          contributors: {
            create: [...contributors, submitterAsContributor],
          },
        },
      }),
    ]);

    return {
      message: "Music submission updated successfully",
      musicSubmission,
    };
  });
