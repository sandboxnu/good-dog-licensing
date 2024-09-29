import { z } from "zod";

import { baseProcedureBuilder } from "../internal/init";

export const helloProcedure = baseProcedureBuilder
  .input(
    z.object({
      text: z.string(),
    }),
  )
  .query(async ({ input }) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return {
      greeting: `hello ${input.text}`,
    };
  });
