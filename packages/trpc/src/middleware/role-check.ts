import { TRPCError } from "@trpc/server";

import {
  adminPagePermissions,
  GoodDogPermissionsFactory,
} from "@good-dog/auth/permissions";
import { Role } from "@good-dog/db";

import { authenticatedProcedureBuilder } from "./authenticated";

export const rolePermissionsProcedureBuilder = <
  Read extends Role,
  Write extends Role,
>(
  permissions: GoodDogPermissionsFactory<Read, Write>,
  key: "read" | "write",
) =>
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (key === "read" && !permissions.canRead(ctx.session.user.role)) {
      throw new TRPCError({
        message: "You do not have permission to read this resource.",
        code: "FORBIDDEN",
      });
    } else if (
      key === "write" &&
      !permissions.canWrite(ctx.session.user.role)
    ) {
      throw new TRPCError({
        message: "You do not have permission to modify this resource.",
        code: "FORBIDDEN",
      });
    }

    return next({ ctx });
  });
