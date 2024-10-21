import {
  deleteAccountIfExistsProcedure,
  signInProcedure,
  signOutProcedure,
  signUpProcedure,
} from "../procedures/auth";
import { getAuthenticatedUserProcedure } from "../procedures/user";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  deleteAccount: deleteAccountIfExistsProcedure,
  user: getAuthenticatedUserProcedure,
});

export type AppRouter = typeof appRouter;
