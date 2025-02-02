import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@good-dog/env";

import { authenticatedProcedureBuilder } from "../middleware/authentictated";

// Expiration date for Moderator Invite is one week
const getModeratorInviteExpirationDate = () =>
  new Date(Date.now() + 3600_000 * 24 * 7);

export const sendModeratorInviteEmailProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      moderatorEmail: z.string().email(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Make sure that the user making the request is an admin
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User does not have correct permissions.",
      });
    }

    // Delete any existing Moderator Invites
    const existingPRInvite = await ctx.prisma.pRInvite.findUnique({
      where: {
        email: input.moderatorEmail,
      },
    });
    if (existingPRInvite) {
      await ctx.prisma.pRInvite.delete({
        where: {
          email: input.moderatorEmail,
        },
      });
    }

    // Create a Moderator Invite
    const createdModeratorInvite = await ctx.prisma.pRInvite.create({
      data: {
        email: input.moderatorEmail,
        expiresAt: getModeratorInviteExpirationDate(),
      },
    });

    // Send email. If sending fails, throw error.
    try {
      await ctx.emailService.sendPRInviteEmail(
        input.moderatorEmail,
        createdModeratorInvite.prInviteId,
      );
    } catch (error) {
      if (env.NODE_ENV === "development") {
        console.error(error);
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Moderator Invite Email to ${input.moderatorEmail} failed to send.`,
          cause: error,
        });
      }
    }

    return {
      message: `Moderator Invite sent to ${input.moderatorEmail}`,
    };
  });

export const onboardModerator = authenticatedProcedureBuilder
  .input(
    z.object({
      moderatorEmail: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z
        .string()
        .regex(
          /[-.\s]?(\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}$/,
          "Phone number must be a valid US format such as 1234567890, 123-456-7890, or (123) 456-7890.",
        ),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {});
