import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

// TODO: Not sure if I need a passwordResetRequest if they are requesting and changing in the same procedure but just in case

export const changePasswordProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      newPassword: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.user.update({
      where: {
        userId: ctx.session.user.userId,
      },
      data: {
        hashedPassword: await ctx.passwordService.hashPassword(
          input.newPassword,
        ),
      },
    });

    return {
      message: "Password reset.",
    };
  });
