import { z } from "zod";
import { baseProcedureBuilder } from "../internal/init";
// const bcrypt = require('bcryptjs');

/*
const hashPassword = async (password: string) => {
    const saltRounds = 10; // Number of salt rounds (higher is more secure, but slower)
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}
*/

export const signUpProcedure = baseProcedureBuilder
    .input(
        z.object({
            email: z.string(),
            password: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        // const hashedPassword = await hashPassword(input.password);

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
            message: `Successfully logged in as ${input.email}`,
            sessionToken: session.token,
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

        /*
        const match = await bcrypt.compare(input.password, user.password);

        if (match === false) {
            throw new Error("Invalid credentials");
        }
        */

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
            message: `Successfully logged in as ${input.email}`,
            sessionToken: session?.token,
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
