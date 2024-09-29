"use client";

import { trpc } from "@good-dog/trpc/client";

export function ClientGreeting() {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "world",
  });

  return (
    <div>
      <div>This code is run on the client</div>
      <div>{data.greeting}</div>
    </div>
  );
}
