import { compare, genSalt, hash } from "bcryptjs";
import { z } from "zod";

import { baseProcedureBuilder } from "../internal/init";

const hashPassword = async (password: string) => {
  const saltRounds = 10; // Number of salt rounds (higher is more secure, but slower)
  const salt = await genSalt(saltRounds);
  return await hash(password, salt);
};

export const signUpProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const existingUser = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new Error(`User already exists for ${input.email}`);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });

    const session = await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        expiresAt: new Date(),
      },
    });

    return {
      message: `Successfully signed up and logged in as ${input.email}`,
      sessionId: session.id,
    };
  });

export const signInProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const match = await compare(input.password, user.password);

    if (!match) {
      throw new Error("Invalid credentials");
    }

    const date = new Date();
    date.setDate(date.getDate() + 30);

    await ctx.prisma.session.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        expiresAt: date,
      },
    });

    const session = await ctx.prisma.session.findFirst({
      where: {
        userId: user.id,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return {
      message: `Successfully logged in as ${input.email}`,
      sessionId: session?.id,
    };
  });

export const signOutProcedure = baseProcedureBuilder
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.prisma.session.delete({
      where: {
        id: input.id,
      },
    });

    return {
      message: "Successfully logged out",
    };
  });

export const deleteAccountIfExistsProcedure = baseProcedureBuilder
  .input(
    z.object({
      email: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new Error(`No user found for ${input.email}`);
    }

    await ctx.prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await ctx.prisma.user.delete({
      where: {
        email: input.email,
      },
    });

    return {
      message: "Successfully deleted account",
    };
  });