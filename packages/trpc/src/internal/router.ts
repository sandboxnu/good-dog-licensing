import {
  deleteAccountProcedure,
  signInProcedure,
  signOutProcedure,
  signUpProcedure,
} from "../procedures/auth";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  deleteAccount: deleteAccountProcedure,
});

export type AppRouter = typeof appRouter;
