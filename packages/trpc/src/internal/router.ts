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
import {
  getProjectScenesProcedure,
  getUserProjectScenesProcedure,
} from "../procedures/get-project-scenes";
import {
  getMusicSubmissionsProcedure,
  getUserMusicSubmissionsProcedure,
} from "../procedures/get-music";
import { getPNRandAdminsProcedure } from "../procedures/get-pnr-and-admins";
import {
  createUpdateMatchCommentsProcedure,
  getMatchesProcedure,
  reviewSuggestedMatchProcedure,
  suggestedMatchProcedure,
} from "../procedures/matches";
import { onboardModeratorProcedure } from "../procedures/onboard-moderator";
import { projectSubmissionProcedure } from "../procedures/project-submission";
import { sendModeratorInviteEmailProcedure } from "../procedures/send-moderator-invite";
import { submitUnlicensedMusicProcedure } from "../procedures/submit-unlicensed-music";
import { submitMusicProcedure } from "../procedures/submitMusicProcedure";
import { unlicensedSuggestedMatchProcedure } from "../procedures/unlicensed-match";
import { getUserProcedure } from "../procedures/user";
import { onboardingProcedure } from "../procedures/user-onboarding";
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
  user: getUserProcedure,
  sendForgotPasswordEmail: sendForgotPasswordEmailProcedure,
  confirmPasswordReset: confirmPasswordResetProcedure,
  adminData: getAdminViewProcedure,
  projects: getProjectScenesProcedure,
  userProjects: getUserProjectScenesProcedure,
  music: getMusicSubmissionsProcedure,
  userMusic: getUserMusicSubmissionsProcedure,
  match: getMatchesProcedure,
  comment: createUpdateMatchCommentsProcedure,
  suggestMatch: suggestedMatchProcedure,
  unlicensedSuggestMatch: unlicensedSuggestedMatchProcedure,
  reviewMatch: reviewSuggestedMatchProcedure,
  sendModeratorInviteEmail: sendModeratorInviteEmailProcedure,
  onboardModerator: onboardModeratorProcedure,
  projectSubmission: projectSubmissionProcedure,
  submitUnlicensedMusic: submitUnlicensedMusicProcedure,
  getPNRAndAdmins: getPNRandAdminsProcedure,
  submitMusic: submitMusicProcedure,
});

export type AppRouter = typeof appRouter;
