import { adminOrModeratorAuthenticatedProcedureBuilder } from "../internal/init";

export const getMusicSubmissionsProcedure = adminOrModeratorAuthenticatedProcedureBuilder.query(
  async ({ ctx }) => {
    const [music] = await Promise.all([
      ctx.prisma.musicSubmission.findMany({
        include: {
            artist: true,
            group: true,
            songwriters: true,
        },
      }),
    ]);
    return { music };
  },
);
