import { helloProcedure } from "../procedures/hello";
import {
  deleteAccountIfExistsProcedure,
  signInProcedure,
  signOutProcedure,
  signUpProcedure,
} from "../procedures/auth";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  hello: helloProcedure,
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  deleteAccount: deleteAccountIfExistsProcedure,
});

export type AppRouter = typeof appRouter;
