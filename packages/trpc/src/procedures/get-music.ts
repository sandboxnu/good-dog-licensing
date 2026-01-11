import {
  musicianOnlyPermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const getMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    include: {
      submitter: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return { music };
});

export const getUserMusicSubmissionsProcedure = rolePermissionsProcedureBuilder(
  musicianOnlyPermissions,
  "read",
).query(async ({ ctx }) => {
  const music = await ctx.prisma.musicSubmission.findMany({
    where: {
      submitterId: ctx.session.user.userId,
    },
    include: {
      submitter: true,
      matches: true,
    },
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
          },
        },
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
