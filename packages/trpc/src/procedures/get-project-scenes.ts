import { projectAndRepetoirePagePermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getProjectScenesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepetoirePagePermissions,
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
