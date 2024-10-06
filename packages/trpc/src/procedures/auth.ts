import { z } from "zod";

import { baseProcedureBuilder } from "../internal/init";

export const signUpProcedure = baseProcedureBuilder
    .input(
        z.object({
            email: z.string(),
            password: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.create({
            data: {
                email: input.email,
                password: input.password,
            },
        });

        const session = await ctx.prisma.session.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                token: crypto.randomUUID(),
                expiresAt: new Date(),
            },
        });

        return {
            response: {
                message: `Successfully logged in as ${input.email}`,
                sessionToken: session.token,
            },
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

        if (user?.password !== input.password) {
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
                token: crypto.randomUUID(),
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
            response: {
                message: `Successfully logged in as ${input.email}`,
                sessionToken: session?.token,
            },
        };
    });

export const signOutProcedure = baseProcedureBuilder
    .input(
        z.object({
            token: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        await ctx.prisma.session.delete({
            where: {
                token: input.token,
            },
        });

        return {
            response: "Successfully logged out",
        };
    });
