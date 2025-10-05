import { getAdminViewProcedure } from "../procedures/admin-view";
import {
  deleteAccountProcedure,
  refreshSessionProcedure,
  signInProcedure,
  signOutProcedure,
} from "../procedures/auth";
import { sendEmailVerificationProcedure } from "../procedures/onboarding/send-email-verification";
import {
  confirmPasswordResetProcedure,
  sendForgotPasswordEmailProcedure,
} from "../procedures/forgot-password";
import {
  getMusicSubmissionsProcedure,
  getUserMusicSubmissionsProcedure,
} from "../procedures/get-music";
import { getPNRandAdminsProcedure } from "../procedures/get-pnr-and-admins";
import {
  getProjectSongRequestByIdProcedure,
  getProjectSongRequestsProcedure,
  getUserSongRequestsProcedure,
  mediamakerProjectsProcedure,
  mediamakerSongRequestsProcedure,
  songRequestProcedure,
} from "../procedures/get-song-requests";
import {
  createMatchProcedure,
  createUpdateMatchCommentsProcedure,
} from "../procedures/matches";
import { mediamakerMatchesProcedure } from "../procedures/mediamaker-matches";
import { submitMusicProcedure } from "../procedures/music-submission";
import { onboardModeratorProcedure } from "../procedures/onboard-moderator";
import { projectSubmissionProcedure } from "../procedures/project/project-submission";
import { sendModeratorInviteEmailProcedure } from "../procedures/send-moderator-invite";
import { getUserProcedure } from "../procedures/user";
import { createTRPCRouter } from "./init";
import { signUpProcedure } from "../procedures/onboarding/sign-up";
import { upsertCommentsProcedure } from "../procedures/comments/upsertComment";

export const appRouter = createTRPCRouter({
  sendEmailVerification: sendEmailVerificationProcedure,
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  refreshSession: refreshSessionProcedure,
  deleteAccount: deleteAccountProcedure,
  user: getUserProcedure,
  sendForgotPasswordEmail: sendForgotPasswordEmailProcedure,
  confirmPasswordReset: confirmPasswordResetProcedure,
  adminData: getAdminViewProcedure,
  projects: getProjectSongRequestsProcedure,
  mediamakerProjects: mediamakerProjectsProcedure,
  mediamakerSongRequests: mediamakerSongRequestsProcedure,
  mediamakerMatches: mediamakerMatchesProcedure,
  userProjects: getUserSongRequestsProcedure,
  music: getMusicSubmissionsProcedure,
  userMusic: getUserMusicSubmissionsProcedure,
  songRequest: songRequestProcedure,
  comment: upsertCommentsProcedure,
  createMatch: createMatchProcedure,
  updateMatch: createUpdateMatchCommentsProcedure,
  sendModeratorInviteEmail: sendModeratorInviteEmailProcedure,
  onboardModerator: onboardModeratorProcedure,
  projectSubmission: projectSubmissionProcedure,
  getPNRAndAdmins: getPNRandAdminsProcedure,
  submitMusic: submitMusicProcedure,
  getSongRequestById: getProjectSongRequestByIdProcedure,
});

export type AppRouter = typeof appRouter;
