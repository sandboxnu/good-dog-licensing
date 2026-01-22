import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

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
