import { TRPCError } from "@trpc/server";

import { env } from "@good-dog/env";

export async function sendEmailHelper(
  sendEmail: () => Promise<unknown>,
  errorMessage: string,
) {
  try {
    await sendEmail();
  } catch (error) {
    console.error(error);
    if (env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: errorMessage,
        cause: error,
      });
    }
  }
}
