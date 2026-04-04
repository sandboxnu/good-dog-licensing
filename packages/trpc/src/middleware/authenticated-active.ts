import { TRPCError } from "@trpc/server";

import { authenticatedOnlyProcedureBuilder } from "./authenticated-only";

export const authenticatedAndActiveProcedureBuilder =
  authenticatedOnlyProcedureBuilder.use(async ({ ctx, next }) => {
    if (!ctx.session.user.active) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({
      ctx,
    });
  });
