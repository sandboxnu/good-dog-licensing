import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { zMessageOutput, zMusicSubmissionOutput } from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";
import { sendEmailHelper } from "../../utils";
import {
  buildSongFields,
  buildSubmitterContributor,
  buildSubmitterProfileUpdate,
} from "./submission-helpers";

const zSubmitMusicOutput = zMessageOutput.extend({
  musicSubmission: zMusicSubmissionOutput,
});

export const submitMusicProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "submit",
)
  .input(zMusicSubmissionValues)
  .output(zSubmitMusicOutput)
  .mutation(async ({ ctx, input }) => {
    const submitterAsContributor = buildSubmitterContributor(
      ctx.session.user,
      input,
    );

    const [_, musicSubmission] = await ctx.prisma.$transaction([
      // Update the user
      ctx.prisma.user.update({
        where: {
          userId: ctx.session.user.userId,
        },
        data: buildSubmitterProfileUpdate(input),
      }),
      // Create the music submission
      ctx.prisma.musicSubmission.create({
        data: {
          submitter: {
            connect: { userId: ctx.session.user.userId },
          },
          ...buildSongFields(input),
          contributors: {
            create: [...input.contributors, submitterAsContributor],
          },
        },
      }),
    ]);

    await sendEmailHelper(
      async () =>
        await ctx.emailService.sendArtistMusicSubmissionConfirmation(
          ctx.session.user.email,
        ),
      "Email failed to send",
    );

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
