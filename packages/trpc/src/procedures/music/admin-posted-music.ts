import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { prisma as prismaClient } from "@good-dog/db";
import {
  adminPagePermissions,
  musicianOnlyPermissions,
} from "@good-dog/auth/permissions";
import { MusicApprovalStatus, Role } from "@good-dog/db";

import {
  zMessageOutput,
  zMusicContributorOutput,
  zMusicSubmissionOutput,
  zUserNameOutput,
} from "../../dto";
import { rolePermissionsProcedureBuilder } from "../../middleware/role-check";
import { zMusicSubmissionValues } from "../../schema";
import { sendEmailHelper } from "../../utils";
import {
  buildSongFields,
  buildSubmitterContributor,
  buildSubmitterProfileUpdate,
} from "./submission-helpers";

/**
 * Admins can post a song on behalf of a musician who already has an account.
 * The song is created exactly as if the musician had submitted it themselves,
 * except it starts as WAITING_FOR_MUSICIAN_REVIEW. It is hidden from matching
 * until the musician reviews it and either approves it (optionally editing it
 * first) or declines it (which deletes it).
 */

const zMusicianOption = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export const getMusiciansProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "read",
)
  .output(z.array(zMusicianOption))
  .query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: { role: Role.MUSICIAN, active: true },
      select: { userId: true, firstName: true, lastName: true, email: true },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });
  });

export const adminSubmitMusicForMusicianProcedure =
  rolePermissionsProcedureBuilder(adminPagePermissions, "submit")
    .input(
      z.object({
        musicianId: z.string(),
        submission: zMusicSubmissionValues,
      }),
    )
    .output(zMessageOutput.extend({ musicSubmission: zMusicSubmissionOutput }))
    .mutation(async ({ ctx, input }) => {
      const musician = await ctx.prisma.user.findUnique({
        where: { userId: input.musicianId },
      });

      if (musician?.role !== Role.MUSICIAN || !musician.active) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Musician not found.",
        });
      }

      // The musician's profile (IPI, affiliation) is only updated once they
      // approve the song, since the admin-entered values may still change.
      const musicSubmission = await ctx.prisma.musicSubmission.create({
        data: {
          submitter: { connect: { userId: musician.userId } },
          postedByAdmin: { connect: { userId: ctx.session.user.userId } },
          approvalStatus: MusicApprovalStatus.WAITING_FOR_MUSICIAN_REVIEW,
          ...buildSongFields(input.submission),
          contributors: {
            create: [
              ...input.submission.contributors,
              buildSubmitterContributor(musician, input.submission),
            ],
          },
        },
      });

      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendArtistSongPostedForReview(
            musician.email,
            musicSubmission.songName,
            musicSubmission.musicId,
          ),
        "Email failed to send",
      );

      return {
        message: "Song posted for musician review",
        musicSubmission,
      };
    });

/** Admin view: every song still waiting on its musician's review. */
export const getPendingMusicForMusiciansProcedure =
  rolePermissionsProcedureBuilder(adminPagePermissions, "read")
    .output(
      z.array(
        zMusicSubmissionOutput.extend({
          submitter: zUserNameOutput,
          postedByAdmin: zUserNameOutput.nullable(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      return ctx.prisma.musicSubmission.findMany({
        where: {
          approvalStatus: MusicApprovalStatus.WAITING_FOR_MUSICIAN_REVIEW,
        },
        include: {
          submitter: { select: { firstName: true, lastName: true } },
          postedByAdmin: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    });

/**
 * Loads a pending song owned by the current musician, throwing if it doesn't
 * exist, belongs to someone else, or has already been reviewed.
 */
async function getOwnPendingSubmission(
  prisma: typeof prismaClient,
  musicId: string,
  userId: string,
) {
  const submission = await prisma.musicSubmission.findUnique({
    where: { musicId },
    include: {
      contributors: true,
      postedByAdmin: { select: { email: true } },
    },
  });

  if (submission?.submitterId !== userId) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Song not found.",
    });
  }

  if (
    submission.approvalStatus !==
    MusicApprovalStatus.WAITING_FOR_MUSICIAN_REVIEW
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This song has already been reviewed.",
    });
  }

  return submission;
}

/** Musician view: the pending song, shaped as the submission form's values. */
export const getPendingMusicSubmissionForReviewProcedure =
  rolePermissionsProcedureBuilder(musicianOnlyPermissions, "read")
    .input(z.object({ musicId: z.string() }))
    .output(
      z.object({
        musicId: z.string(),
        contributors: z.array(zMusicContributorOutput),
        songName: z.string(),
        songLink: z.string(),
        genres: zMusicSubmissionOutput.shape.genres,
        additionalInfo: z.string(),
        songLyrics: z.string(),
        performerName: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return getOwnPendingSubmission(
        ctx.prisma,
        input.musicId,
        ctx.session.user.userId,
      );
    });

export const approvePendingMusicSubmissionProcedure =
  rolePermissionsProcedureBuilder(musicianOnlyPermissions, "submit")
    .input(
      z.object({
        musicId: z.string(),
        submission: zMusicSubmissionValues,
      }),
    )
    .output(zMessageOutput)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const pending = await getOwnPendingSubmission(
        ctx.prisma,
        input.musicId,
        user.userId,
      );

      // Same writes as a regular musician submission, applied to the
      // existing record: the musician's edits replace whatever the admin
      // entered, contributors included.
      await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { userId: user.userId },
          data: buildSubmitterProfileUpdate(input.submission),
        }),
        ctx.prisma.musicContributor.deleteMany({
          where: { musicSubmissionId: pending.musicId },
        }),
        ctx.prisma.musicSubmission.update({
          where: { musicId: pending.musicId },
          data: {
            ...buildSongFields(input.submission),
            approvalStatus: MusicApprovalStatus.APPROVED,
            contributors: {
              create: [
                ...input.submission.contributors,
                buildSubmitterContributor(user, input.submission),
              ],
            },
          },
        }),
      ]);

      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendArtistMusicSubmissionConfirmation(
            user.email,
          ),
        "Email failed to send",
      );
      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendAdminMusicianReviewedSong(
            pending.postedByAdmin?.email ?? null,
            `${user.firstName} ${user.lastName}`,
            input.submission.songName,
            true,
          ),
        "Email failed to send",
      );

      return { message: "Song approved" };
    });

export const declinePendingMusicSubmissionProcedure =
  rolePermissionsProcedureBuilder(musicianOnlyPermissions, "submit")
    .input(z.object({ musicId: z.string() }))
    .output(zMessageOutput)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const pending = await getOwnPendingSubmission(
        ctx.prisma,
        input.musicId,
        user.userId,
      );

      await ctx.prisma.musicSubmission.delete({
        where: { musicId: pending.musicId },
      });

      await sendEmailHelper(
        async () =>
          await ctx.emailService.sendAdminMusicianReviewedSong(
            pending.postedByAdmin?.email ?? null,
            `${user.firstName} ${user.lastName}`,
            pending.songName,
            false,
          ),
        "Email failed to send",
      );

      return { message: "Song declined" };
    });
