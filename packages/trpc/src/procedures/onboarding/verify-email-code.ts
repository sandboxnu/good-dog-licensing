import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { notAuthenticatedProcedureBuilder } from "../../middleware/not-authenticated";

export const verifyEmailCodeProcedure = notAuthenticatedProcedureBuilder
  .input(z.object({ email: z.email(), emailCode: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const emailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
          code: input.emailCode,
        },
      });

    if (emailVerificationCode) {
      return {
        status: "VALID" as const,
        message: `Email verification code is valid`,
      };
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Email verification code is invalid`,
    });
  });
