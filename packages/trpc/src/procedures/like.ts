import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Rating } from "@good-dog/db";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

export const createMatchRatingProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      ratingId: z.string().optional(),
      ratingEnum: z.nativeEnum(Rating),
      matchId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    if (input.ratingId) {
      const rating = await ctx.prisma.matchRatings.findFirst({
        where: {
          ratingId: input.ratingId,
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
        await ctx.prisma.matchRatings.create({
          data: {
            userId: ctx.session.user.userId,
            ratingEnum: input.ratingEnum,
            unlicensedSuggestedMatchId: input.matchId,
          },
        });
      }
    }
  });
