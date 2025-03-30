import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { adminPagePermissions } from "@good-dog/auth/permissions";
import { env } from "@good-dog/env";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

// Expiration date for Moderator Invite is one week
const getModeratorInviteExpirationDate = () =>
  new Date(Date.now() + 3600_000 * 24 * 7);

export const sendModeratorInviteEmailProcedure =
  rolePermissionsProcedureBuilder(adminPagePermissions, "write")
    .input(
      z.object({
        moderatorEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Delete any exisiting moderator invites and create a new one
      const [, createdModeratorInvite] = await ctx.prisma.$transaction([
        ctx.prisma.moderatorInvite.deleteMany({
          where: {
            email: input.moderatorEmail,
          },
        }),
        ctx.prisma.moderatorInvite.create({
          data: {
            email: input.moderatorEmail,
            expiresAt: getModeratorInviteExpirationDate(),
          },
        }),
      ]);

      // Send email. If sending fails, throw error.
      try {
        await ctx.emailService.sendPRInviteEmail(
          input.moderatorEmail,
          createdModeratorInvite.moderatorInviteId,
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
