import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@good-dog/ui";

const buttonVariants = cva("rounded-lg", {
  variants: {
    variant: {
      contained:
        "border-[0.5px] border-dark-gray-500 bg-green-400 text-mint-300 hover:bg-green-500 active:bg-green-600 dark:border-dark-gray-300 dark:bg-green-300 dark:hover:bg-green-400 dark:active:bg-green-500",
      outlined:
        "border-[0.5px] border-dark-gray-500 bg-cream-100 text-green-500 hover:bg-mint-200 active:bg-mint-300 dark:border-dark-gray-300 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-500 dark:active:bg-green-600",
      text: "text-bg-green-500 bg-transparent hover:bg-mint-200 active:bg-mint-300 dark:text-mint-200 dark:hover:bg-mint-200 dark:hover:text-green-500 dark:active:bg-mint-400",
    },
    size: {
      "small-text": "!text-body4 h-[32px] px-[16px]",
      "medium-text": "h-[40px] w-[104px] !text-body3",
      "large-text": "h-[48px] w-[128px] !text-body2",
      "flex-text": "!text-body4 h-[24px] w-fit px-2",
      "small-text-with-icon": "!text-body4 h-[32px] w-[80px]",
      "medium-text-with-icon": "h-[40px] w-[120px] !text-body3",
      "large-text-with-icon": "h-[48px] w-[136px] !text-body2",
      "flex-text-with-icon": "h-[24px] w-fit px-2 !text-base",
      "small-icon": "h-[32px] w-[32px]",
      "medium-icon": "h-[40px] w-[40px]",
      "large-icon": "h-[48px] w-[48px]",
      "flex-icon": "h-[24px] w-fit px-2",
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
