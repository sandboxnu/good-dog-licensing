import { helloProcedure } from "../procedures/hello";
import { getAuthenticatedUserProcedure } from "../procedures/user";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  hello: helloProcedure,
  user: getAuthenticatedUserProcedure,
});

export type AppRouter = typeof appRouter;
