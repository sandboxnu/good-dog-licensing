import { z } from "zod";

/**
 * Generic response for mutations that don't need to send anything back
 * besides a human readable confirmation. Still required on every mutation
 * (see eslint rule in ../../eslint.config.js) so that a resolver can never
 * accidentally start returning a raw DB row later without a schema change.
 */
export const zMessageOutput = z.object({
  message: z.string(),
});
