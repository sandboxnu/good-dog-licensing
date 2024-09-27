# tRPC

## What is tRPC?

tRPC is a framework for building end-to-end typesafe APIs using TypeScript. It allows you to define your API routes and their input/output types in a single place, ensuring type safety across your entire stack. With tRPC, you can avoid the need for REST or GraphQL and directly call your backend functions from your frontend with full type safety.

## How to Use tRPC in This Project

### Setup

tRPC is already set up in this project. The main components are available through the `@good-dog/trpc` package. Here is a brief overview of the key imports:

- `@good-dog/trpc/client`: Sets up the tRPC client for use in React components.
- `@good-dog/trpc/server`: Server side helpers used for preloading data and other server side actions
- `@good-dog/trpc/next`: This export is used to set up the API in our Next.js app

### Adding a New Procedure

To add a new procedure, follow these steps:

1. **Define the Procedure:**

   Create a new file in the `procedures` directory, e.g., `packages/trpc/src/procedures/goodbye.ts`:

   ```ts
   import { z } from "zod";

   import { baseProcedureBuilder } from "../internal/init";

   export const goodbyeProcedure = baseProcedureBuilder
     .input(
       z.object({
         name: z.string(),
       }),
     )
     .query(async ({ input }) => {
       return {
         farewell: `Goodbye, ${input.name}`,
       };
     });
   ```

2. **Add the Procedure to the Router:**

   Update the `appRouter` in `packages/trpc/src/internal/router.ts`:

   ```ts
   import { goodbyeProcedure } from "../procedures/goodbye";
   import { helloProcedure } from "../procedures/hello";
   import { createTRPCRouter } from "./init";

   export const appRouter = createTRPCRouter({
     hello: helloProcedure,
     goodbye: goodbyeProcedure,
   });

   export type AppRouter = typeof appRouter;
   ```

3. **Use the Procedure on the Server:**

   We can begin the data fetching BEFORE the render starts, which provides a much faster user experience

   ```tsx
   import { Suspense } from "react";

   import { HydrateClient, trpc } from "@good-dog/trpc/server";

   export default async function Page() {
     void trpc.goodbye.prefetch({
       name: "world",
     });

     return (
       <HydrateClient>
         <div>
           This code is never run on the client {new Date().toTimeString()}
         </div>
         {/** ... */}
         <Suspense fallback={<div>Loading fallback...</div>}>
           <GoodbyeComponent>
         </Suspense>
       </HydrateClient>
     );
   }
   ```

4. **Use the Procedure in the Client:**

   You can now call the new procedure from your frontend components using the tRPC client:

   ```tsx
   import { trpc } from "@good-dog/trpc/client";

   const GoodbyeComponent = () => {
     const [data] = trpc.goodbye.useSuspenseQuery({ name: "Alice" });

     return <div>{data.farewell}</div>;
   };
   ```

## Best Practices

- **Type Safety:** Always define input types using `zod` to ensure type safety, use zod internally or define the output type if calling a third party library.
- **Error Handling:** Use tRPC's built-in error handling mechanisms to provide meaningful error messages.
- **Code Organization:** Keep the procedures organized in the `procedures` directory.
- **Testing:** Write tests for all procedures to ensure they work as expected.

## Testing with tRPC

### Unit Testing

You can write unit tests for your tRPC procedures using the `_trpcCaller` export. Here is an example test for the `hello` procedure:

```ts
import { expect, test } from "bun:test";

import { _trpcCaller } from "@good-dog/trpc/server";

test("hello world", async () => {
  const result = await _trpcCaller.hello({ text: "world" });
  expect(result.greeting).toEqual("hello world");
});
```
