import type { VariantProps } from "class-variance-authority";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@good-dog/ui";

const buttonVariants = cva("rounded-lg", {
  variants: {
    variant: {
      contained:
        "bg-good-dog-main text-[#E9F9F1] hover:bg-[#054233] active:bg-[#022119]",
      outlined:
        "border-[0.5px] border-[#404040] bg-[#FFFDFB] text-[#054233] hover:bg-[#E9F9F1] active:bg-[#D3F4E2]",
      text: "bg-transparent text-[#054233] hover:bg-[#E9F9F1] active:bg-[#D3F4E2]",
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
