import React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@good-dog/ui";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "focus-visible:ring-ring focus-visible:ring-offset-background group relative inline-flex h-[35px] w-[100px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-gray-300 dark:data-[state=checked]:bg-green-300",
      className,
    )}
    {...props}
    ref={ref}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 text-xs font-[14px] text-cream-100 group-data-[state=checked]:block dark:text-mint-200"
    >
      ACTIVE
    </span>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 block -translate-y-1/2 text-xs font-[14px] text-dark-gray-300 group-data-[state=checked]:hidden"
    >
      INACTIVE
    </span>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[24px] w-[24px] rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[69px] data-[state=unchecked]:translate-x-1 data-[state=checked]:bg-cream-100 data-[state=unchecked]:bg-dark-gray-300 dark:data-[state=checked]:bg-mint-200",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
