# @good-dog/auth/permissions

This package provides a set of permissions and permissions utilities that can be used to protect the API procedures and web pages.

## Resources

Inside [resources.ts](./resources.ts) you can find individual permission sets

Here’s an updated version of the **Resources** section in the README.md:

## Resources

Inside [resources.ts](./resources.ts), you can find individual permission sets defined using the `GoodDogPermissionsFactory`. These permission sets specify which roles have access to perform certain actions (e.g., `read` or `write`) on various pages or resources.

Most permissions should extend the `superUserPermissions` permission set, which grants full access to superusers (Admins). Then, with the `extend` method, you can specify which other roles have access to read and write on a particular page or resource.

### Examples

- **`projectAndRepetoirePagePermissions`**: Extends `adminPagePermissions` to allow `MODERATOR` roles to read and write.

  ```ts
  export const projectAndRepetoirePagePermissions = adminPagePermissions.extend(
    {
      read: [Role.MODERATOR],
      write: [Role.MODERATOR],
    },
  );
  ```

- **`onboardingPagePermissions`**: Grants `ONBOARDING` roles access to read and write.

  ```ts
  export const onboardingPagePermissions = superUserPermissions.extend({
    read: [Role.ONBOARDING],
    write: [Role.ONBOARDING],
  });
  ```

## Protecting Web Pages

We can use these permission sets to protect API procedures and web pages. For example

```ts
export const iceCreamPagePermissions = superUserPermissions.extend({
  read: [Role.ICE_CREAM_ENTHUSIAST, Role.ICE_CREAM_VENDOR],
  write: [Role.ICE_CREAM_VENDOR],
});
```

```tsx
import { iceCreamPagePermissions } from "@good-dog/auth/permissions";
import { layoutWithPermissions } from "@good-dog/components/PermissionsWrapper";

function IceCreamPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>Welcome to the Ice Cream Pages</nav>
      {children}
    </div>
  );
}

export default layoutWithPermissions(
  iceCreamPagePermissions,
  IceCreamPageLayout,
);
```

In this example, the `layoutWithPermissions` higher-order component wraps the `OnboardingLayout` component, ensuring that only users with the appropriate permissions, as defined in `iceCreamPagePermissions`, can access the Ice Cream Pages.

The `layoutWithPermissions` higher-order component is provided by the `@good-dog/components` package and is used in layout files to protect all child-pages from unauthorized access.

`layoutWithPermissions` does not require a second argument if no additional layout is needed. For example:

```tsx
import { iceCreamPagePermissions } from "@good-dog/auth/permissions";
import { layoutWithPermissions } from "@good-dog/components/PermissionsWrapper";

export default layoutWithPermissions(iceCreamPagePermissions);
```

This would protect all child pages from unauthorized access and then just render the child pages.

### Further Reading

I recommend taking a look at [Next.js | Pages and Layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts) to understand how layouts and pages work in Next.js.

## Protecting API Procedures

We can use these permissions with the [rolePermissionsProcedureBuilder](../../../trpc//src//middleware//role-check.ts) to protect API procedures. For example

```ts
import { iceCreamPagePermissions } from "@good-dog/auth/permissions";

export const createIceCreamSaleMutation = rolePermissionsProcedureBuilder(
  iceCreamPagePermissions,
  "write",
)
  .input(
    z.object({
      flavor: z.string(),
      brand: z.string(),
      price: z.number(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    // Your code here.
    // You can be sure that the user has the correct permissions to run this procedure
  });
```
