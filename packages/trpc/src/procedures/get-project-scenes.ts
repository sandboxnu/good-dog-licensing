import {
  mediaMakerOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectScenesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const projects = await ctx.prisma.projectSubmission.findMany({
    include: {
      scenes: true,
      projectOwner: true,
    },
  });
  return { projects };
});

export const getUserProjectScenesProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
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
