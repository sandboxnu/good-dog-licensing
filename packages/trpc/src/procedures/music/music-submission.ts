import { musicianOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";

export const submitMusicProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "submit",
)
  .input(zMusicSubmissionValues)
  .mutation(async ({ ctx, input }) => {
    // Creates a contributor for the submitter to be added to the music submission's list of contributors
    const submitterAsContributor = {
      name: `${ctx.session.user.firstName} ${ctx.session.user.lastName}`,
      roles: input.submitterRoles,
      affiliation: input.submitterAffiliation,
      ipi: input.submitterIpi,
      isSubmitter: true,
    };

    const [_, musicSubmission] = await ctx.prisma.$transaction([
      // Update the user
      ctx.prisma.user.update({
        where: {
          userId: ctx.session.user.userId,
        },
        data: {
          ipi: input.submitterIpi ? input.submitterIpi : undefined,
          affiliation: input.submitterAffiliation ? input.submitterAffiliation : undefined,
        },
      }),
      // Create the music submission
      ctx.prisma.musicSubmission.create({
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
            create: [...input.contributors, submitterAsContributor],
          },
        },
      }),
    ]);

    //Proceed with music submission
    return {
      message: "Music submitted successfully",
      musicSubmission,
    };
  });
