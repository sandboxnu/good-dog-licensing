import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@good-dog/ui";

const buttonVariants = cva("rounded-lg", {
  variants: {
    variant: {
      contained:
        "bg-green-400 dark:bg-green-300 text-mint-200 hover:bg-green-500 active:bg-green-600",
      outlined:
        "border-[0.5px] border-gray-600 bg-cream-100 text-green-500 hover:bg-mint-200 active:bg-mint-300",
      text: "bg-transparent text-bg-green-500 hover:bg-mint-200 active:bg-mint-300",
    },
    size: {
      "small-text": "h-[31px] px-[16px] !text-body4", // NOTE: really forced...
      "medium-text": "h-[40px] w-[104px] !text-body3",
      "large-text": "h-[48px] w-[128px] !text-body2",
      "small-text-with-icon": "h-[31px] w-[80px] !text-body4",
      "medium-text-with-icon": "h-[40px] w-[120px] !text-body3",
      "large-text-with-icon": "h-[48px] w-[136px] !text-body2",
      "small-icon": "h-[31px] w-[32px]",
      "medium-icon": "h-[40px] w-[40px]",
      "large-icon": "h-[48px] w-[48px]",
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
