import React from "react";

import { cn } from "@good-dog/ui";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    icon?: React.ReactNode;
  }
>(({ className, type, icon, ...props }, ref) => {
  if (!icon) {
    return (
      <input
        type={type}
        className={cn("border-input border", className)}
        ref={ref}
        {...props}
      />
    );
  }
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        type={type}
        className={cn("border-input w-full border pl-10", className)}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };
