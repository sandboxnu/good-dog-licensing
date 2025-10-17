import { MatchState, prisma, Role } from "@good-dog/db";
import z from "zod";
import { authenticatedProcedureBuilder } from "../../middleware/authenticated";
import { TRPCError } from "@trpc/server";

export const updateMatchStateProcedure = authenticatedProcedureBuilder
  .input(z.object({ matchId: z.string(), state: z.enum(MatchState) }))
  .mutation(async ({ ctx, input }) => {
    const role = ctx.session.user.role;
    const mediamaker_only_check =
      (input.state == MatchState.SONG_REQUESTED ||
        input.state == MatchState.REJECTED_BY_MEDIA_MAKER) &&
      role != Role.MEDIA_MAKER;
    const musician_only_check =
      (input.state == MatchState.REJECTED_BY_MUSICIAN ||
        input.state == MatchState.APPROVED_BY_MUSICIAN) &&
      role != Role.MUSICIAN;

    if (input.state == MatchState.NEW) {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: `Cannot update a match back to NEW state`,
      });
    } else if (mediamaker_only_check || musician_only_check) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `This role does not have permission to perform the requested match state change`,
      });
    }

    const match = await prisma.match.findFirst({
      where: { matchId: input.matchId },
      include: {
        musicSubmission: true,
        songRequest: {
          include: {
            projectSubmission: true,
          },
        },
      },
    });

    if (!match) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Match id does not exist`,
      });
    }

    // If media maker, then it needs to be their project
    if (
      role == Role.MEDIA_MAKER &&
      match.songRequest.projectSubmission.projectOwnerId !=
        ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Media makers can only update the state of matches that involve their projects`,
      });
    }
    // If music maker, then it needs to be their music
    if (
      role == Role.MUSICIAN &&
      match.musicSubmission.submitterId != ctx.session.user.userId
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Musicians can only update the state of matches that involve their projects`,
      });
    }

    const result = await prisma.match.update({
      where: { matchId: input.matchId },
      data: { matchState: input.state },
    });

    return {
      message: "Match state updated successfully",
      match: result,
    };
  });
