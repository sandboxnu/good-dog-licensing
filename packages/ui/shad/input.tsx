import React from "react";

import { cn } from "@good-dog/ui";
import X from "./X";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    icon?: React.ReactNode;
    onClear?: () => void;
  }
>(({ className, type, icon, value, onClear, ...props }, ref) => {
  const showClearButton = onClear && value;
  const hasWrapper = icon ?? onClear;

  if (!icon && !showClearButton) {
    return (
      <input
        type={type}
        className={cn("border-input border", className)}
        ref={ref}
        value={value}
        {...props}
      />
    );
  }

  // `hasWrapper` ensures that the html structure is static when there is an icon / onClear so the
  // component doesn't re-render in weird places, effectively forcing the user to click back into the textArea
  return (
    <div className="relative w-full">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn("border-input w-full border", icon && "pl-10", className)}
        ref={ref}
        value={value}
        {...props}
      />
      {showClearButton && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-0 top-0 flex h-full items-center px-2 text-[#858585] hover:text-[#404040]"
          aria-label="Clear input"
        >
          <X />
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
