import { TRPCError } from "@trpc/server";

import { authenticatedProcedureBuilder } from "./authenticated";

export const musicianAuthenticatedProcedureBuilder =
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (ctx.session.user.role !== "MUSICIAN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only musicians can access this.",
      });
    }

    return next({ ctx });
  });
