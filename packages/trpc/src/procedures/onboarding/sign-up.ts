import { TRPCError } from "@trpc/server";

import { notAuthenticatedProcedureBuilder } from "../../middleware/not-authenticated";
import { zSignUpValues } from "../../schema";
import {
  getEmailVerificationCodeExpirationDate,
  sendVerificationEmailHelper,
} from "./util";

const getNewSessionExpirationDate = () =>
  new Date(Date.now() + 60_000 * 60 * 24 * 30);

export const signUpProcedure = notAuthenticatedProcedureBuilder
  .input(zSignUpValues)
  .mutation(async ({ ctx, input }) => {
    // Check is user already exists with given email
    const existingUserWithEmail = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUserWithEmail) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `User already exists with email ${input.email}`,
      });
    }

    // Verify email
    const emailVerificationCode =
      await ctx.prisma.emailVerificationCode.findUnique({
        where: {
          email: input.email,
        },
      });

    // Resend email if code is expired
    if (emailVerificationCode && emailVerificationCode.expiresAt < new Date()) {
      const emailCode = await sendVerificationEmailHelper(
        ctx.emailService,
        input.email,
      );

      const result = await ctx.prisma.emailVerificationCode.update({
        where: {
          email: input.email,
        },
        data: {
          code: emailCode,
          expiresAt: getEmailVerificationCodeExpirationDate(),
        },
      });

      return {
        status: "RESENT" as const,
        email: result.email,
        message: `Code is expired. A new code was sent to ${input.email}.`,
      };
    }

    if (
      !emailVerificationCode ||
      emailVerificationCode.code !== input.emailCode
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Email ${input.email} has not been verified`,
      });
    }

    // If here, email is verified, so create user and delete the email verification code
    const hashedPassword = await ctx.passwordService.hashPassword(
      input.password,
    );

    const [userWithSession] = await ctx.prisma.$transaction([
      ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          role: input.role,
          email: input.email,
          phoneNumber: input.phoneNumber,
          hashedPassword: hashedPassword,
          sessions: {
            create: {
              expiresAt: getNewSessionExpirationDate(),
            },
          },
          referral: input.referral,
        },
        select: {
          sessions: true,
        },
      }),
      ctx.prisma.emailVerificationCode.delete({
        where: {
          email: input.email,
        },
      }),
    ]);

    const session = userWithSession.sessions[0];

    if (!session) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create session",
      });
    }

    ctx.cookiesService.setSessionCookie(session.sessionId, session.expiresAt);

    return {
      message: `Successfully signed up and logged in as ${input.email}.`,
    };
  });
