import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  musicianOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import {
  zMatchWithProjectContextOutput,
  zMusicContributorOutput,
  zMusicSubmissionAdminRowOutput,
  zMusicSubmissionOutput,
  zUserMusicSubmissionRowOutput,
  zUserNameOutput,
} from "../dto";
import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .output(z.array(zMusicSubmissionAdminRowOutput))
  .query(async ({ ctx }) => {
    const music = await ctx.prisma.musicSubmission.findMany({
      include: {
        submitter: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        contributors: true,
      },
    });
    return music;
  });

export const getUserMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
)
  .output(z.object({ music: z.array(zUserMusicSubmissionRowOutput) }))
  .query(async ({ ctx }) => {
    const music = await ctx.prisma.musicSubmission.findMany({
      where: {
        submitterId: ctx.session.user.userId,
      },
      select: {
        musicId: true,
        songName: true,
        createdAt: true,
        performerName: true,
        genres: true,
        musicianSongStatus: true,
      },
    });
    return { music };
  });

// The detail view for a single music submission: the submission itself,
// plus every match it's involved in and enough of that match's project
// context (song request/project/owner name) to render it.
const zMusicSubmissionDetailOutput = zMusicSubmissionOutput.extend({
  submitter: zUserNameOutput,
  contributors: z.array(zMusicContributorOutput),
  matches: z.array(zMatchWithProjectContextOutput),
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
  .output(zMusicSubmissionDetailOutput)
  .query(async ({ ctx, input }) => {
    const musicSubmission = await ctx.prisma.musicSubmission.findUnique({
      where: {
        musicId: input.musicId,
      },
      include: {
        submitter: true,
        matches: {
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
            contract: true,
          },
        },
        contributors: true,
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
