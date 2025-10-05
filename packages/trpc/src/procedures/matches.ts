import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  adminPagePermissions,
  projectAndRepertoirePagePermissions,
} from "@good-dog/auth/permissions";
import { MatchState } from "@good-dog/db";

import { rolePermissionsProcedureBuilder } from "../middleware/role-check";

export const createMatchProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "modify",
)
  .input(
    z.object({
      songRequestId: z.string().optional(), // Required for creation
      musicId: z.string().optional(), // Required for creation
    }),
  )
  .mutation(async ({ ctx, input }) => {
    //create new match
    if (!input.songRequestId || !input.musicId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Missing required fields for creating a match.",
      });
    }

    await ctx.prisma.match.create({
      data: {
        songRequestId: input.songRequestId,
        musicId: input.musicId,
        matcherUserId: ctx.session.user.userId,
        matchState: MatchState.NEW,
      },
    });

    return {
      message: "Match successfully created.",
    };
  });

export const reviewMatchProcedure = rolePermissionsProcedureBuilder(
  adminPagePermissions,
  "modify",
)
  .input(
    z.object({
      matchId: z.string(),
      matchState: z.nativeEnum(MatchState),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.match.update({
      where: {
        matchId: input.matchId,
      },
      data: {
        matchState: input.matchState,
      },
    });
  });

export const getMatchesProcedure = rolePermissionsProcedureBuilder(
  projectAndRepertoirePagePermissions,
  "read",
)
  .input(
    z.object({
      matchState: z.nativeEnum(MatchState),
    }),
  )
  .query(async ({ ctx, input }) => {
    const matches = await ctx.prisma.match.findMany({
      where: {
        matchState: input.matchState,
      },
    });
    return { matches };
  });
