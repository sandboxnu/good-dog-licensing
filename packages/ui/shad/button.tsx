import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@good-dog/ui";

const buttonVariants = cva("border-[8px] ", {
  variants: {
    variant: {
      contained: "bg-[#07634C]",
      outlined:
        "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      text: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      medium: "h-[40px] w-[104px]",
      large: "h-8 rounded-md px-3 text-xs",
    },
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
