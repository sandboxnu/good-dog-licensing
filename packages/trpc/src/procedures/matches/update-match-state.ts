import { TRPCError } from "@trpc/server";
import z from "zod";

import { MatchState, Role } from "@good-dog/db";

import { authenticatedAndActiveProcedureBuilder } from "../../middleware/authenticated-active";
import { sendEmailHelper } from "../../utils";

const allowedStartingStatesByRole: Record<Role, MatchState[]> = {
  [Role.MEDIA_MAKER]: [MatchState.SENT_TO_MEDIA_MAKER],
  [Role.MUSICIAN]: [MatchState.SENT_TO_MUSICIAN],
  [Role.ADMIN]: [MatchState.WAITING_FOR_MANAGER_APPROVAL],
  [Role.MODERATOR]: [MatchState.WAITING_FOR_MANAGER_APPROVAL],
};

const allowedEndingStatesByRole: Record<Role, MatchState[]> = {
  [Role.MEDIA_MAKER]: [
    MatchState.SENT_TO_MUSICIAN,
    MatchState.REJECTED_BY_MEDIA_MAKER,
  ],
  [Role.MUSICIAN]: [
    MatchState.APPROVED_BY_MUSICIAN,
    MatchState.REJECTED_BY_MUSICIAN,
  ],
  [Role.ADMIN]: [
    MatchState.SENT_TO_MEDIA_MAKER,
    MatchState.REJECTED_BY_MANAGER,
  ],
  [Role.MODERATOR]: [
    MatchState.SENT_TO_MEDIA_MAKER,
    MatchState.REJECTED_BY_MANAGER,
  ],
};

export const updateMatchStateProcedure = authenticatedAndActiveProcedureBuilder
  .input(z.object({ matchId: z.string(), state: z.enum(MatchState) }))
  .mutation(async ({ ctx, input }) => {
    const match = await ctx.prisma.match.findUnique({
      where: { matchId: input.matchId },
      include: {
        musicSubmission: {
          include: {
            submitter: true,
          },
        },
        songRequest: {
          include: {
            projectSubmission: {
              include: {
                projectOwner: true,
                projectManager: true,
              },
            },
          },
        },
      },
    });

    if (!match) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Match id does not exist`,
      });
    }

    const role = ctx.session.user.role;

    // Make sure starting matchState and ending matchState are allowed for this role
    const isAllowedStartingState = allowedStartingStatesByRole[role].includes(
      match.matchState,
    );
    const isAllowedEndingState = allowedEndingStatesByRole[role].includes(
      input.state,
    );
    if (!isAllowedStartingState || !isAllowedEndingState) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This role does not have permission to perform the requested match state change.`,
      });
    }

    // If media maker, then it needs to be their project
    if (
      role === Role.MEDIA_MAKER &&
      match.songRequest.projectSubmission.projectOwnerId !==
        ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Media makers can only update the state of matches that involve their projects`,
      });
    }
    // If music maker, then it needs to be their music
    if (
      role === Role.MUSICIAN &&
      match.musicSubmission.submitterId !== ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Musicians can only update the state of matches that involve their projects`,
      });
    }

    // If moderator, then they must be the project manager (admins can bypass)
    if (
      role === Role.MODERATOR &&
      match.songRequest.projectSubmission.projectManagerId !==
        ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Moderators can only update the state of matches that are managed by them`,
      });
    }

    // If we made it here, all checks passed, so update the match state
    const result = await ctx.prisma.match.update({
      where: { matchId: input.matchId },
      data: { matchState: input.state },
    });

    // Here send notification emails as appropriate
    await sendEmailHelper(async () => {
      switch (input.state) {
        case "SENT_TO_MEDIA_MAKER":
          await ctx.emailService.sendMediaMakerSongSuggestionByPM(
            match.songRequest.projectSubmission.projectOwner.email,
            match.musicSubmission.songName,
            match.songRequest.projectSubmission.projectTitle,
            match.songRequest.songRequestId,
          );

          await ctx.emailService.sendAdminAndPMSongSuggestionSentToMM(
            ctx.session.user.firstName + ctx.session.user.lastName,
            match.musicSubmission.songName,
            match.musicSubmission.performerName,
            match.songRequest.projectSubmission.projectTitle,
            match.songRequest.projectSubmission.projectId,
            match.songRequest.projectSubmission.projectManager?.email,
          );
          break;
        case "SENT_TO_MUSICIAN":
          await ctx.emailService.sendArtistSongRequestedForBrief(
            match.musicSubmission.submitter.email,
            match.musicSubmission.songName,
            match.musicSubmission.musicId,
            match.songRequest.projectSubmission.projectTitle,
          );

          await ctx.emailService.sendAdminAndPMSongSuggestionApprovedByMM(
            match.songRequest.projectSubmission.projectOwner.firstName,
            match.musicSubmission.songName,
            match.musicSubmission.performerName,
            match.songRequest.projectSubmission.projectTitle,
            match.songRequest.projectSubmission.projectId,
            match.songRequest.projectSubmission.projectManager?.email,
          );
          break;
        case "APPROVED_BY_MUSICIAN":
          await ctx.emailService.sendMediaMakerLicenseComplete(
            match.songRequest.projectSubmission.projectOwner.email,
            match.musicSubmission.songName,
            match.songRequest.projectSubmission.projectTitle,
            match.songRequest.songRequestId,
          );

          await ctx.emailService.sendArtistLicenseComplete(
            match.musicSubmission.submitter.email,
            match.musicSubmission.songName,
            match.songRequest.projectSubmission.projectTitle,
            match.musicSubmission.musicId,
          );

          await ctx.emailService.sendAdminAndPMLicenseSigned(
            match.songRequest.projectSubmission.projectOwner.firstName,
            match.musicSubmission.submitter.firstName,
            match.songRequest.projectSubmission.projectTitle,
            match.songRequestId,
            match.songRequest.projectSubmission.projectManager?.email,
          );
          break;
      }
    }, "Email failed to send");

    return {
      message: "Match state updated successfully",
      match: result,
    };
  });
