import { getAdminViewProcedure } from "../procedures/admin-view";
import {
  deleteAccountProcedure,
  signInProcedure,
  signOutProcedure,
  signUpProcedure,
} from "../procedures/auth";
import {
  confirmEmailProcedure,
  sendEmailVerificationProcedure,
} from "../procedures/email-verification";
import {
  confirmPasswordResetProcedure,
  sendForgotPasswordEmailProcedure,
} from "../procedures/forgot-password";
import {
  onboardModeratorProcedure,
  sendModeratorInviteEmailProcedure,
} from "../procedures/moderator_onboarding";
import {
  getAuthenticatedUserProcedure,
  getUserProcedure,
} from "../procedures/user";
import { onboardingProcedure } from "../procedures/user_onboarding";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  sendEmailVerification: sendEmailVerificationProcedure,
  confirmEmail: confirmEmailProcedure,
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  onboarding: onboardingProcedure,
  deleteAccount: deleteAccountProcedure,
  authenticatedUser: getAuthenticatedUserProcedure,
  user: getUserProcedure,
  sendForgotPasswordEmail: sendForgotPasswordEmailProcedure,
  confirmPasswordReset: confirmPasswordResetProcedure,
  adminData: getAdminViewProcedure,
  sendModeratorInviteEmail: sendModeratorInviteEmailProcedure,
  onboardModerator: onboardModeratorProcedure,
});

export type AppRouter = typeof appRouter;
