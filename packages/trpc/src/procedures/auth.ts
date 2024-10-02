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
        ctx.prisma.user.create({
            data: {
                email: input.email,
                password: input.password,
            },
        });

        return {
            response: `Successfully logged in as ${input.email}`,
        };
    });