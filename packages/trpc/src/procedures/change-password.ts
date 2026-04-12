import { z } from "zod";

import { authenticatedAndActiveProcedureBuilder } from "../middleware/authenticated-active";

export const changePasswordProcedure = authenticatedAndActiveProcedureBuilder
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
