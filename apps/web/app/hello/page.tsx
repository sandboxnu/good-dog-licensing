import { Suspense } from "react";

import { HydrateClient, trpc } from "@good-dog/trpc/server";

import { ClientGreeting } from "./Greeting";

export default async function Page() {
  void trpc.hello.prefetch({
    text: "world",
  });

  return (
    <HydrateClient>
      <div>
        This code is never run on the client {new Date().toTimeString()}
      </div>
      {/** ... */}
      <Suspense
        fallback={
          <div>Loading fallback: this code is also never run on the server</div>
        }
      >
        <ClientGreeting />
      </Suspense>
    </HydrateClient>
  );
}
