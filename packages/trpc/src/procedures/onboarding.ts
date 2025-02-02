import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authentictated";
import { zPreProcessEmptyString } from "../utils";

export const onboardingProcedure = authenticatedProcedureBuilder
  .input(
    z.discriminatedUnion("role", [
      z.object({
        role: z.literal("MEDIA_MAKER"),
        firstName: z.string(),
        lastName: z.string(),
        discovery: z.string().optional(),
      }),
      z.object({
        role: z.literal("MUSICIAN"),
        firstName: zPreProcessEmptyString(z.string()),
        lastName: zPreProcessEmptyString(z.string()),
        groupName: zPreProcessEmptyString(z.string()),
        stageName: zPreProcessEmptyString(z.string().optional()),
        isSongWriter: z.boolean().optional(),
        isAscapAffiliated: z.boolean().optional(),
        isBmiAffiliated: z.boolean().optional(),
        groupMembers: z
          .array(
            z.object({
              firstName: zPreProcessEmptyString(z.string()),
              lastName: zPreProcessEmptyString(z.string()),
              stageName: zPreProcessEmptyString(z.string().optional()),
              email: zPreProcessEmptyString(z.string().email()),
              isSongWriter: z.boolean().optional(),
              isAscapAffiliated: z.boolean().optional(),
              isBmiAffiliated: z.boolean().optional(),
            }),
          )
          .optional(),
        discovery: z.string().optional(),
      }),
    ]),
  )
  .mutation(async ({ ctx, input }) => {
    if (ctx.session.user.role !== "ONBOARDING") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User has already onboarded",
      });
    }

    if (input.role === "MEDIA_MAKER") {
      await ctx.prisma.user.update({
        data: {
          role: "MEDIA_MAKER",
          firstName: input.firstName,
          lastName: input.lastName,
        },
        where: {
          userId: ctx.session.userId,
        },
      });
    } else {
      await ctx.prisma.user.update({
        data: {
          role: "MUSICIAN",
          firstName: input.firstName,
          lastName: input.lastName,
          stageName: input.stageName,
          isSongWriter: input.isSongWriter,
          isAscapAffiliated: input.isAscapAffiliated,
          isBmiAffiliated: input.isBmiAffiliated,
          musicianGroups: {
            create: {
              name: input.groupName,
              groupMembers: {
                createMany: {
                  data:
                    input.groupMembers?.map((member) => ({
                      email: member.email,
                      firstName: member.firstName,
                      lastName: member.lastName,
                      stageName: member.stageName,
                      isSongWriter: member.isSongWriter,
                      isAscapAffiliated: member.isAscapAffiliated,
                      isBmiAffiliated: member.isBmiAffiliated,
                    })) ?? [],
                },
              },
            },
          },
        },
        where: {
          userId: ctx.session.userId,
        },
      });
    }

    revalidatePath("/onboarding");

    return {
      message: "Successfully onboarded",
    };
  });
