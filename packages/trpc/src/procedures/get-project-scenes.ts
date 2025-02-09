import { adminOrModeratorAuthenticatedProcedureBuilder } from "../internal/init";

export const getProjectScenesProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const projects = await ctx.prisma.projectSubmission.findMany({
      include: {
        scenes: true,
        projectOwner: true,
      },
    });
    return { projects };
  });
