import { authenticatedProcedureBuilder } from "../internal/init";

export const getAuthenticatedUserProcedure =
  authenticatedProcedureBuilder.query(({ ctx }) => {
    return ctx.session.user;
  });
