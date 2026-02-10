import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@good-dog/env";

import { notAuthenticatedProcedureBuilder } from "../../middleware/not-authenticated";
import { zPasswordValidation } from "../../schema";

// Expiration date for Moderator Invite is one week
const getModeratorInviteExpirationDate = () =>
  new Date(Date.now() + 3600_000 * 24 * 7);

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const onboardModeratorProcedure = notAuthenticatedProcedureBuilder
  .input(
    z.object({
      moderatorInviteId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z
        .string()
        .regex(
          /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
          "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
        ),
      password: zPasswordValidation,
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Get the moderator invite
    const moderatorInvite = await ctx.prisma.moderatorInvite.findUnique({
      where: {
        moderatorInviteId: input.moderatorInviteId,
      },
    });

    // If there is no moderator invite found, throw error
    if (!moderatorInvite) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }
    // If moderator invite is expired, resend it
    if (moderatorInvite.expiresAt < new Date()) {
      // Delete current moderator invite and create a new one
      const [, createdModeratorInvite] = await ctx.prisma.$transaction([
        ctx.prisma.moderatorInvite.delete({
          where: {
            moderatorInviteId: input.moderatorInviteId,
          },
        }),
        ctx.prisma.moderatorInvite.create({
          data: {
            email: moderatorInvite.email,
            expiresAt: getModeratorInviteExpirationDate(),
          },
        }),
      ]);

      // Send email. If sending fails, throw error.
      try {
        await ctx.emailService.sendPRInviteEmail(
          createdModeratorInvite.email,
          createdModeratorInvite.moderatorInviteId,
        );
      } catch (error) {
        if (env.NODE_ENV === "development") {
          console.error(error);
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Moderator Invite Email to ${createdModeratorInvite.email} failed to resend.`,
            cause: error,
          });
        }
      }

      return {
        status: "RESENT" as const,
        message: `Invite is expired. A new invite was sent to ${createdModeratorInvite.email}.`,
      };
    }

    // If here, the moderator invite is valid. So we onboard the moderator.
    const hashedPassword = await ctx.passwordService.hashPassword(
      input.password,
    );

    const [userWithSession] = await ctx.prisma.$transaction([
      ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          role: "MODERATOR",
          email: moderatorInvite.email,
          hashedPassword: hashedPassword,
          phoneNumber: input.phoneNumber,
          sessions: {
            create: {
              expiresAt: getNewSessionExpirationDate(),
            },
          },
          active: true,
        },
        select: {
          sessions: true,
        },
      }),
      ctx.prisma.moderatorInvite.delete({
        where: {
          moderatorInviteId: input.moderatorInviteId,
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

    ctx.cookiesService.setSessionCookie(session.sessionId, session.expiresAt);

    return {
      status: "SUCCESS" as const,
      message: `Successfully signed up and logged in as ${moderatorInvite.email}.`,
    };
  });
