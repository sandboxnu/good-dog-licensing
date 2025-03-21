import { TRPCError } from "@trpc/server";

import { authenticatedProcedureBuilder } from "./authenticated";

export const adminAuthenticatedProcedureBuilder =
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return next({ ctx });
  });
