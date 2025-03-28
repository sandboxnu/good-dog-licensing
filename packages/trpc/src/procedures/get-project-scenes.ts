import { mediaMakerAuthenticatedProcedureBuilder } from "../middleware/mediamaker";
import { adminOrModeratorAuthenticatedProcedureBuilder } from "../middleware/moderator-admin-authenticated";

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

export const getUserProjectScenesProcedure =
  mediaMakerAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const projects = await ctx.prisma.projectSubmission.findMany({
      where: {
        projectOwnerId: ctx.session.user.userId,
      },
      include: {
        scenes: true,
        projectOwner: true,
      },
    });
    return { projects };
  });
