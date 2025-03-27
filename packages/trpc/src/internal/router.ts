import { getAdminViewProcedure } from "../procedures/admin-view";
import {
  deleteAccountProcedure,
  refreshSessionProcedure,
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
import { getMusicSubmissionsProcedure } from "../procedures/get-music";
import { getProjectScenesProcedure } from "../procedures/get-project-scenes";
import {
  createUpdateMatchCommentsProcedure,
  getMatchesProcedure,
  reviewSuggestedMatchProcedure,
  suggestedMatchProcedure,
} from "../procedures/matches";
import { onboardModeratorProcedure } from "../procedures/onboard_moderator";
import { sendModeratorInviteEmailProcedure } from "../procedures/send_moderator_invite";
import { submitUnlicensedMusicProcedure } from "../procedures/submit-unlicensed-music";
import { submitMusicProcedure } from "../procedures/submitMusicProcedure";
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
  refreshSession: refreshSessionProcedure,
  onboarding: onboardingProcedure,
  deleteAccount: deleteAccountProcedure,
  authenticatedUser: getAuthenticatedUserProcedure,
  user: getUserProcedure,
  sendForgotPasswordEmail: sendForgotPasswordEmailProcedure,
  confirmPasswordReset: confirmPasswordResetProcedure,
  adminData: getAdminViewProcedure,
  projects: getProjectScenesProcedure,
  music: getMusicSubmissionsProcedure,
  match: getMatchesProcedure,
  comment: createUpdateMatchCommentsProcedure,
  suggestMatch: suggestedMatchProcedure,
  reviewMatch: reviewSuggestedMatchProcedure,
  sendModeratorInviteEmail: sendModeratorInviteEmailProcedure,
  onboardModerator: onboardModeratorProcedure,
  submitUnlicensedMusic: submitUnlicensedMusicProcedure,
  submitMusic: submitMusicProcedure,
});

export type AppRouter = typeof appRouter;
