import type { TRPCError } from "@trpc/server";

/**
 * Logs a failed tRPC call on the server with its procedure path and the
 * underlying cause.
 *
 * Without this, a procedure that fails during a server-side prefetch only
 * shows up in production logs as `Error: redacted` (TanStack Query hides the
 * error before it reaches the browser), so there is no way to tell which
 * procedure failed or why.
 */
export function logTrpcError({
  error,
  path,
  type,
}: {
  error: TRPCError;
  path: string | undefined;
  type: string;
}) {
  const summary = `[tRPC] ${type} "${path ?? "<unknown>"}" failed with ${error.code}: ${error.message}`;

  // Expected client errors (bad input, not logged in, ...) are logged
  // without a stack trace; everything else gets the full cause.
  if (error.code === "INTERNAL_SERVER_ERROR") {
    console.error(summary, error.cause ?? error);
  } else {
    console.warn(summary);
  }
}
