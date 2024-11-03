import {
  confirmEmailProcedure,
  deleteAccountProcedure,
  sendEmailVerificationProcedure,
  signInProcedure,
  signOutProcedure,
  signUpProcedure,
} from "../procedures/auth";
import { getAuthenticatedUserProcedure } from "../procedures/user";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  sendEmailVerification: sendEmailVerificationProcedure,
  confirmEmail: confirmEmailProcedure,
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  deleteAccount: deleteAccountProcedure,
  user: getAuthenticatedUserProcedure,
});

export type AppRouter = typeof appRouter;
