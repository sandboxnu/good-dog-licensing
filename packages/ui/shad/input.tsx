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
        className={cn("border border-input", className)}
        ref={ref}
        {...props}
      />
    );
  }
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        className={cn("border border-input w-full pl-10", className)}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };
