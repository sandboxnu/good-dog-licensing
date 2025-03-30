import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminOrModeratorAuthenticatedProcedureBuilder } from "../middleware/moderator-admin-authenticated";

export const getMusicSubmissionsProcedure =
  adminOrModeratorAuthenticatedProcedureBuilder.query(async ({ ctx }) => {
    const music = await ctx.prisma.musicSubmission.findMany({
      include: {
        artist: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        group: {
          select: {
            name: true,
          },
        },
        songwriters: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return { music };
  });
