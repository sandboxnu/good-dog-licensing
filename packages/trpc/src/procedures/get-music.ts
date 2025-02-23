import { adminOrModeratorAuthenticatedProcedureBuilder } from "../middleware/moderator-admin-authenticated";

export const getMusicSubmissionsProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const [music] = await ctx.prisma.musicSubmission.findMany({
      include: {
        artist: true,
        group: true,
        songwriters: true,
      },
    });
    return { music };
  });
