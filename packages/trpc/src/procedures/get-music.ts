import { adminOrModeratorAuthenticatedProcedureBuilder } from "../middleware/moderator-admin-authenticated";
import { musicianAuthenticatedProcedureBuilder } from "../middleware/musician";

export const getMusicSubmissionsProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const music = await ctx.prisma.musicSubmission.findMany({
      include: {
        artist: true,
        group: true,
        songwriters: true,
      },
    });
    return { music };
  });

export const getUserMusicSubmissionsProcedure =
  musicianAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const music = await ctx.prisma.musicSubmission.findMany({
      where: {
        artistId: ctx.session.user.userId,
      },
      include: {
        artist: true,
        group: true,
        songwriters: true,
      },
    });
    return { music };
  });
