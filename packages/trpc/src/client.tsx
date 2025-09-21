"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import { env } from "@good-dog/env";

import type { AppRouter } from "./internal/router";
import { QueryClientFactory } from "./internal/query-client-factory";

export const trpc = createTRPCReact<AppRouter>();

const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return QueryClientFactory.createNew();
  }
  // Browser: use singleton pattern to keep the same query client
  return QueryClientFactory.singleton;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (env.VERCEL_ENV === "production") {
    return `https://good-dog-licensing.vercel.app`;
  }
  if (env.VERCEL_ENV) return `https://${env.VERCEL_ENV}`;
  return "http://localhost:3000";
};

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
