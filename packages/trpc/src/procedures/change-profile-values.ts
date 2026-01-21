import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";
import { MusicAffiliation } from "@good-dog/db";

// TODO: Not sure if I need a passwordResetRequest if they are requesting and changing in the same procedure but just in case

export const changeProfileValuesProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      email: z.email(),
      firstName: z.string(),
      lastName: z.string(),
      affiliation: z.enum(MusicAffiliation).optional(),
      ipi: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        affiliation: input.affiliation,
        ipi: input.ipi,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }
    return {
      message: "Profile values updated.",
    };
  });
