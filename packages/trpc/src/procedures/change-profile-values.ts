import { z } from "zod";

import { MusicAffiliation } from "@good-dog/db";
import { authenticatedAndActiveProcedureBuilder } from "../middleware/authenticated-active";

export const changeProfileValuesProcedure =
  authenticatedAndActiveProcedureBuilder
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
