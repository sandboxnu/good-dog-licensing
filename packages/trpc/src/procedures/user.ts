import type { UserWithSession } from "../types";
import { baseProcedureBuilder } from "../internal/init";
import { getSessionMemoized } from "../internal/prisma-abstraction";
import { authenticatedAndActiveProcedureBuilder } from "../middleware/authenticated-active";
import { z } from "zod";

export const getUserProcedure = baseProcedureBuilder.query(async ({ ctx }) => {
  const sessionId = ctx.cookiesService.getSessionCookie();

  if (!sessionId?.value) {
    return null;
  }

  const sessionOrNull = await getSessionMemoized(ctx.prisma, sessionId.value);

  if (!sessionOrNull || sessionOrNull.expiresAt < new Date()) {
    // Session expired or not found
    return null;
  }

  const result: UserWithSession = {
    ...sessionOrNull.user,
    session: {
      expiresAt: sessionOrNull.expiresAt,
      refreshRequired:
        // Refresh session if it expires in less than 29 days
        sessionOrNull.expiresAt.getTime() - Date.now() < 60_000 * 60 * 24 * 29,
    },
  };

  return result;
});

export const getUserByIdProcedure = authenticatedAndActiveProcedureBuilder
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { userId: input.userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        affiliation: true,
        createdAt: true,

        musicSubmissions: {
          select: {
            musicId: true,
            songName: true,
            songLink: true,
            genres: true,
            additionalInfo: true,
            contributors: true,
            createdAt: true,
          },
        },
        projectSubmissionsAsOwner: {
          select: {
            projectId: true,
            projectTitle: true,
            projectType: true,
            deadline: true,
            description: true,
            additionalInfo: true,
            songRequests: true,
            createdAt: true,
          },
        },
        projectSubmissionsAsManager: {
          select: {
            projectId: true,
            projectTitle: true,
            projectType: true,
            deadline: true,
            description: true,
            additionalInfo: true,
            songRequests: true,
            createdAt: true,
          },
        },
      },
    });

    return user;
  });
