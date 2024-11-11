import { revalidatePath } from "next/cache";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { deleteSessionCookie, setSessionCookie } from "@good-dog/auth/cookies";
import { comparePassword, hashPassword } from "@good-dog/auth/password";

import {
  authenticatedProcedureBuilder,
  notAuthenticatedProcedureBuilder,
} from "../internal/init";
import { zPreProcessEmptyString } from "../utils";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const signUpProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const [emailVerificationCode, existingUserWithEmail] = await Promise.all([
      ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      }),
      ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      }),
    ]);

    // Throw error if email is not verified
    if (!emailVerificationCode?.emailConfirmed) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Email has not been verified.",
      });
    }

    if (existingUserWithEmail) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.email}`,
      });
    }

    const hashedPassword = await hashPassword(input.password);

    const [userWithSession] = await ctx.prisma.$transaction([
      ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          role: "ONBOARDING",
          email: input.email,
          hashedPassword: hashedPassword,
          sessions: {
            create: {
              expiresAt: getNewSessionExpirationDate(),
            },
          },
        },
        select: {
          sessions: true,
        },
      }),
      ctx.prisma.emailVerificationCode.delete({
        where: {
          email: input.email,
        },
      }),
    ]);

    const session = userWithSession.sessions[0];

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create session",
      });
    }

    setSessionCookie(session.sessionId, session.expiresAt);

    return {
      message: `Successfully signed up and logged in as ${input.email}.`,
    };
  });

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
      // groupName: input.groupName,
      // groupMembers: {
      //   createMany: {
      //     data: input.groupMembers,
      //   },
      // },
      await ctx.prisma.user.update({
        data: {
          role: "MUSICIAN",
          firstName: input.firstName,
          lastName: input.lastName,
          stageName: input.stageName,
          isSongWriter: input.isSongWriter,
          isAscapAffiliated: input.isAscapAffiliated,
          isBmiAffiliated: input.isBmiAffiliated,
          groups: {
            create: {
              name: input.groupName,
              invites: {
                createMany: {
                  data:
                    input.groupMembers?.map((member) => ({
                      intitiatorId: ctx.session.userId,
                      email: member.email,
                      firstName: member.firstName,
                      lastName: member.lastName,
                      stageName: member.stageName,
                      isSongWriter: member.isSongWriter,
                      isAscapAffiliated: member.isAscapAffiliated,
                      isBmiAffiliated: member.isBmiAffiliated,
                      role: "MUSICIAN",
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

export const signInProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    const error = () =>
      new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });

    if (!user) {
      // Failed loggin attempt, don't reveal if user exists
      throw error();
    }

    const match = await comparePassword(input.password, user.hashedPassword);

    if (!match) {
      throw error();
    }

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            userId: user.userId,
          },
        },
        expiresAt: getNewSessionExpirationDate(),
      },
    });

    setSessionCookie(session.sessionId, session.expiresAt);

    return {
      message: `Successfully logged in as ${input.email}`,
    };
  });

export const signOutProcedure = authenticatedProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.session.delete({
      where: {
        sessionId: ctx.session.sessionId,
      },
    });

    deleteSessionCookie();

    return {
      message: "Successfully logged out",
    };
  },
);

export const deleteAccountProcedure = authenticatedProcedureBuilder.mutation(
  async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        userId: ctx.session.userId,
      },
    });

    deleteSessionCookie();

    return {
      message: "Successfully deleted account",
    };
  },
);
