import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";
import { MusicAffiliation } from "@good-dog/db";

export const changeProfileValuesProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      affiliation: z.enum(MusicAffiliation).optional().nullable(),
      ipi: z.string().optional().nullable(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: {
        userId: ctx.session.user.userId,
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        affiliation: input.affiliation,
        ipi: input.ipi,
      },
    });

    return {
      message: "Profile values updated.",
    };
  });
