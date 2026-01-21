import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { authenticatedProcedureBuilder } from "../middleware/authenticated";

// TODO: Not sure if I need a passwordResetRequest if they are requesting and changing in the same procedure but just in case

export const changeNewPasswordByEmailProcedure = authenticatedProcedureBuilder
  .input(
    z.object({
      email: z.email(),
      newPassword: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    await ctx.prisma.user.update({
      where: {
        email: input.email,
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
