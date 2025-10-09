import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

// gets all the matches for this song request, along with their music, and ratings
// TODO: test this procedure as mentioned in #152
export const mediamakerMatchesProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "read",
)
  .input(
    z.object({
      projectId: z.string(),
      songRequestId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const songRequest = await ctx.prisma.songRequest.findFirst({
      where: {
        projectId: input.projectId,
        songRequestId: input.songRequestId,
      },
      include: {
        suggestedMatches: {
          include: {
            musicSubmission: {
              include: {
                submitter: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            matchLikes: true,
          },
        },
        projectSubmission: true,
      },
    });

    if (!songRequest) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Song Request not found.",
      });
    }

    if (
      ctx.session.user.role !== "ADMIN" &&
      songRequest.projectSubmission.projectOwnerId !== ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Song Request not found.",
      });
    }

    const matches = songRequest.suggestedMatches;

    return {
      matches: matches,
    };
  });
