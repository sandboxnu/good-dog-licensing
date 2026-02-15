import { getAdminAndModeratorUsers } from "../procedures/admin-view";
import {
  deleteAccountProcedure,
  signInProcedure,
  signOutProcedure,
} from "../procedures/auth";
import { changePasswordProcedure } from "../procedures/change-password";
import { changeProfileValuesProcedure } from "../procedures/change-profile-values";
import { upsertCommentsProcedure } from "../procedures/comments/upsertComment";
import {
  confirmPasswordResetProcedure,
  sendForgotPasswordEmailProcedure,
} from "../procedures/forgot-password";
import {
  getMusicSubmissionByIdProcedure,
  getMusicSubmissionsProcedure,
  getUserMusicSubmissionsProcedure,
} from "../procedures/get-music";
import { getPNRandAdminsProcedure } from "../procedures/get-pnr-and-admins";
import {
  getAllProjectsWithSongRequestsAndMatchesProcedure,
  getProjectSubmissionByIdProcedure,
} from "../procedures/get-project";
import {
  getProjectSongRequestByIdProcedure,
  getProjectSongRequestsProcedure,
  getUserSongRequestsProcedure,
  mediamakerProjectsProcedure,
  mediamakerSongRequestsProcedure,
  songRequestProcedure,
} from "../procedures/get-song-requests";
import { createMatchProcedure } from "../procedures/matches/create-match";
import { deleteMatchProcedure } from "../procedures/matches/delete-match";
import { updateMatchStateProcedure } from "../procedures/matches/update-match-state";
import { mediamakerMatchesProcedure } from "../procedures/mediamaker-matches";
import { getMusicSubmissionPrefillValuesProcedure } from "../procedures/music/get-submission-prefill-vals";
import { submitMusicProcedure } from "../procedures/music/music-submission";
import { onboardModeratorProcedure } from "../procedures/onboard-moderator";
import { sendEmailVerificationProcedure } from "../procedures/onboarding/send-email-verification";
import { signUpProcedure } from "../procedures/onboarding/sign-up";
import { verifyEmailCodeProcedure } from "../procedures/onboarding/verify-email-code";
import { assignProjectManagerProcedure } from "../procedures/project/assign-project-manager";
import { projectSubmissionProcedure } from "../procedures/project/project-submission";
import { songRequestSubmissionProcedure } from "../procedures/project/song-request-submission";
import { sendModeratorInviteEmailProcedure } from "../procedures/send-moderator-invite";
import { getUserProcedure } from "../procedures/user";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  sendEmailVerification: sendEmailVerificationProcedure,
  verifyEmailCode: verifyEmailCodeProcedure,
  signIn: signInProcedure,
  signOut: signOutProcedure,
  signUp: signUpProcedure,
  deleteAccount: deleteAccountProcedure,
  user: getUserProcedure,
  sendForgotPasswordEmail: sendForgotPasswordEmailProcedure,
  confirmPasswordReset: confirmPasswordResetProcedure,
  adminAndModeratorUsers: getAdminAndModeratorUsers,
  projects: getProjectSongRequestsProcedure,
  mediamakerProjects: mediamakerProjectsProcedure,
  mediamakerSongRequests: mediamakerSongRequestsProcedure,
  mediamakerMatches: mediamakerMatchesProcedure,
  allProjects: getAllProjectsWithSongRequestsAndMatchesProcedure,
  userProjects: getUserSongRequestsProcedure,
  updateMatchState: updateMatchStateProcedure,
  allMusic: getMusicSubmissionsProcedure,
  userMusic: getUserMusicSubmissionsProcedure,
  songRequest: songRequestProcedure,
  comment: upsertCommentsProcedure,
  createMatch: createMatchProcedure,
  sendModeratorInviteEmail: sendModeratorInviteEmailProcedure,
  onboardModerator: onboardModeratorProcedure,
  projectSubmission: projectSubmissionProcedure,
  getPNRAndAdmins: getPNRandAdminsProcedure,
  submitMusic: submitMusicProcedure,
  getSongRequestById: getProjectSongRequestByIdProcedure,
  getMusicSubmissionPrefillVals: getMusicSubmissionPrefillValuesProcedure,
  deleteMatch: deleteMatchProcedure,
  songRequestSubmission: songRequestSubmissionProcedure,
  getProjectSubmissionById: getProjectSubmissionByIdProcedure,
  getMusicSubmissionById: getMusicSubmissionByIdProcedure,
  changePassword: changePasswordProcedure,
  changeProfileValues: changeProfileValuesProcedure,
  assignProjectManager: assignProjectManagerProcedure,
});

export type AppRouter = typeof appRouter;
