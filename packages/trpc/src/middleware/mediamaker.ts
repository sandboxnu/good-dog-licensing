import { TRPCError } from "@trpc/server";

import { authenticatedProcedureBuilder } from "./authenticated";

export const mediaMakerAuthenticatedProcedureBuilder =
  authenticatedProcedureBuilder.use(async ({ ctx, next }) => {
    if (ctx.session.user.role !== "MEDIA_MAKER") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only media makers can access this.",
      });
    }

    return next({ ctx });
  });
