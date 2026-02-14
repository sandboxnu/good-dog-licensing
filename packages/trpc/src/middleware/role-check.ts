import { TRPCError } from "@trpc/server";

import type { GoodDogPermissionsFactory } from "@good-dog/auth/permissions";
import type { Role } from "@good-dog/db";

import { authenticatedAndActiveProcedureBuilder } from "./authenticated-active";

export const rolePermissionsProcedureBuilder = <
  Read extends Role,
  Modify extends Role,
  Submit extends Role,
>(
  permissions: GoodDogPermissionsFactory<Read, Modify, Submit>,
  key: "read" | "modify" | "submit",
) =>
  authenticatedAndActiveProcedureBuilder.use(async ({ ctx, next }) => {
    switch (key) {
      case "read":
        if (!permissions.canRead(ctx.session.user.role)) {
          throw new TRPCError({
            message: "You do not have permission to read this resource.",
            code: "FORBIDDEN",
          });
        }
        break;
      case "modify":
        if (!permissions.canModify(ctx.session.user.role)) {
          throw new TRPCError({
            message: "You do not have permission to modify this resource.",
            code: "FORBIDDEN",
          });
        }
        break;
      case "submit":
        if (!permissions.canSubmit(ctx.session.user.role)) {
          throw new TRPCError({
            message: "You do not have permission to submit to this resource.",
            code: "FORBIDDEN",
          });
        }
        break;
      default:
        // This case should never be hit due to the type system, but we handle it
        // here just in case
        throw new TRPCError({
          message: "Invalid permissions key",
          code: "INTERNAL_SERVER_ERROR",
        });
    }

    return next({ ctx });
  });
