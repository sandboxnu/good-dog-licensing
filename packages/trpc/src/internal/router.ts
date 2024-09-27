import { helloProcedure } from "../procedures/hello";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  hello: helloProcedure,
});

export type AppRouter = typeof appRouter;
