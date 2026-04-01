import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  musicianOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import {
  publicMusicContributorSelect,
  publicMusicSubmissionFullSelect,
  publicMusicSubmissionSummarySelect,
  publicMatchSelect,
  publicSongRequestFullSelect,
  publicProjectFullSelect,
  publicUserFullSelect,
  publicUserSummarySelect,
} from "../dtos";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    select: {
      ...publicMusicSubmissionFullSelect,
      submitter: { select: publicUserSummarySelect },
      contributors: { select: publicMusicContributorSelect },
    },
  });
  return music;
});

export const getUserMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    where: {
      submitterId: ctx.session.user.userId,
    },
    select: publicMusicSubmissionSummarySelect,
  });
  return { music };
});

export const getMusicSubmissionByIdProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
)
  .input(
    z.object({
      musicId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const musicSubmission = await ctx.prisma.musicSubmission.findUnique({
      where: {
        musicId: input.musicId,
      },
      select: {
        ...publicMusicSubmissionFullSelect,
        submitter: { select: publicUserFullSelect },
        matches: {
          select: {
            ...publicMatchSelect,
            songRequest: {
              select: {
                ...publicSongRequestFullSelect,
                projectSubmission: {
                  select: {
                    ...publicProjectFullSelect,
                    projectOwner: { select: publicUserSummarySelect },
                  },
                },
              },
            },
          },
        },
        contributors: { select: publicMusicContributorSelect },
      },
    });

    if (!musicSubmission) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Project Song Request ID was not found.`,
      });
    }

    if (musicSubmission.submitterId !== ctx.session.user.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `You do not have permission to view this song request.`,
      });
    }

    return musicSubmission;
  });
