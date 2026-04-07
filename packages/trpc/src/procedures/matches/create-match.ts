import { z } from "zod";

import { projectAndRepertoirePagePermissions } from "@good-dog/auth/permissions";
import {
  MatchState,
  AdmModMatchStatus,
  MediaMakerMatchStatus,
  MusicianMatchStatus,
} from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { sendEmailHelper } from "../../utils";
import { TRPCError } from "@trpc/server";
import { updateStatuses } from "../../utils/status/update-status";

export const createMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(
    z.object({
      songRequestId: z.string(),
      musicId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Create match
    const createdMatch = await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: MatchState.WAITING_FOR_MANAGER_APPROVAL,
        admModStatus: AdmModMatchStatus.APPROVAL_NEEDED,
        mediaMakerStatus: MediaMakerMatchStatus.HIDDEN,
        musicianStatus: MusicianMatchStatus.HIDDEN,
      },
      include: {
        songRequest: {
          include: {
            projectSubmission: {
              include: {
                projectOwner: true,
              },
            },
          },
        },
        musicSubmission: {
          include: {
            submitter: true,
            contributors: true,
          },
        },
      },
    });

    await ctx.prisma.contract.create({
      data: {
        matchId: createdMatch.matchId,
        date: createdMatch.createdAt,
        licensorFullName:
          createdMatch.musicSubmission.submitter.firstName +
          " " +
          createdMatch.musicSubmission.submitter.lastName,
        licensorPhone: createdMatch.musicSubmission.submitter.phoneNumber,
        licensorEmail: createdMatch.musicSubmission.submitter.email,
        licensorEntity: createdMatch.musicSubmission.performerName,
        licenseeFullName:
          createdMatch.songRequest.projectSubmission.projectOwner.firstName +
          " " +
          createdMatch.songRequest.projectSubmission.projectOwner.lastName,
        licenseePhone:
          createdMatch.songRequest.projectSubmission.projectOwner.phoneNumber,
        licenseeEmail:
          createdMatch.songRequest.projectSubmission.projectOwner.email,
        licenseeEntity: createdMatch.songRequest.projectSubmission.projectTitle,
        productionTitle:
          createdMatch.songRequest.projectSubmission.projectTitle,
        productionDescription:
          createdMatch.songRequest.projectSubmission.description,
        scopeOfUse: "TODO",
        songRequestDescription: createdMatch.songRequest.description,
        durationOfUse: "TODO",
        locationOfUse: "TODO",
        songTitle: createdMatch.musicSubmission.songName,
        contractMusicContributors: {
          create: createdMatch.musicSubmission.contributors.flatMap((c) =>
            c.roles.map((role) => ({
              contributorFullName: c.firstName + " " + c.lastName,
              contributorRole: role,
              contributorAffiliation: c.affiliation ?? null,
              contributorEmail: c.isSubmitter
                ? createdMatch.musicSubmission.submitter.email
                : "",
            })),
          ),
        },
      },
    });

    // Update statuses of match, SR, and project
    await updateStatuses(
      createdMatch.songRequest.projectId,
      createdMatch.songRequestId,
      createdMatch.matchId,
      createdMatch.musicSubmission.musicId,
    );

    const songRequest = await ctx.prisma.songRequest.findUnique({
      where: { songRequestId: input.songRequestId },
      include: { projectSubmission: { include: { projectManager: true } } },
    });

    if (!songRequest) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Song Request not found.",
      });
    }

    const music = await ctx.prisma.musicSubmission.findUnique({
      where: { musicId: input.musicId },
    });

    if (!music) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Music not found.",
      });
    }

    const projectManager = songRequest.projectSubmission.projectManager;
    if (projectManager) {
      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendPMSongSuggestionAddedToBrief(
            projectManager.email,
            ctx.session.user.firstName + " " + ctx.session.user.lastName,
            music.songName,
            music.performerName,
            songRequest.projectSubmission.projectTitle,
            songRequest.songRequestId,
          ),
        "Email failed to send",
      );
    }

    return {
      message: "Match successfully created.",
    };
  });
