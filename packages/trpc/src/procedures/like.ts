import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { mediaMakerOnlyPermissions } from "@good-dog/auth/permissions";
import { Rating } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const createMatchRatingProcedure = rolePermissionsProcedureBuilder(
  mediaMakerOnlyPermissions,
  "submit",
)
  .input(
    z.object({
      ratingId: z.string().optional(),
      ratingEnum: z.nativeEnum(Rating),
      matchId: z.string(),
      unlicensed: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (input.ratingId) {
      const rating = await ctx.prisma.matchRatings.findFirst({
        where: {
          ratingId: input.ratingId,
          unlicensedSuggestedMatchId: input.matchId,
        },
      });

      if (rating) {
        if (rating.userId === ctx.session.user.userId) {
          await ctx.prisma.matchRatings.update({
            where: {
              ratingId: input.ratingId,
            },
            data: {
              ratingEnum: input.ratingEnum,
            },
          });
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Rating does not exist.",
          });
        }
      } else {
        if (input.unlicensed) {
          await ctx.prisma.matchRatings.create({
            data: {
              userId: ctx.session.user.userId,
              ratingEnum: input.ratingEnum,
              unlicensedSuggestedMatchId: input.matchId,
            },
          });
        } else {
          await ctx.prisma.matchRatings.create({
            data: {
              userId: ctx.session.user.userId,
              ratingEnum: input.ratingEnum,
              suggestedMatchId: input.matchId,
            },
          });
        }
      }
    }
  });
