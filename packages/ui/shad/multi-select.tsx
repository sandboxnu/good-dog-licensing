import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cva } from "class-variance-authority";
import { CheckIcon, ChevronDown } from "lucide-react";

import { cn } from "@good-dog/ui";
import { Badge } from "@good-dog/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@good-dog/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@good-dog/ui/popover";

import X from "./X";

const multiSelectVariants = cva(
  "my-0.5 flex h-6 flex-row gap-1 border-[1px] text-body3",
  {
    variants: {
      variant: {
        standard:
          "rounded-lg border-green-400 bg-mint-300 !text-green-400",
        hover:
          "rounded-lg border-green-400 bg-green-400 !text-mint-300",
        inactive: "rounded-lg border-dark-gray-300 bg-white !text-dark-gray-300",
        round_standard:
          "rounded-2xl border-green-400 bg-mint-300 !text-green-400",
        round_hover:
          "rounded-2xl border-green-400 bg-green-400 !text-mint-300",
        round_inactive: "rounded-2xl border-dark-gray-300 bg-white !text-dark-gray-300",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  },
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;

  /** The controlled value of selected items */
  value?: string[];

  /** @deprecated Use `value` prop instead for controlled behavior */
  defaultValue?: string[];

  placeholder?: string;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      value, // Now accepting value prop
      defaultValue = [],
      placeholder = "Select options",
      maxCount = 3,
      modalPopover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalSelectedValues, setInternalSelectedValues] =
      React.useState<string[]>(defaultValue);

    const selectedValues = isControlled ? value : internalSelectedValues;

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues, option];

      onValueChange(newSelectedValues);

      if (!isControlled) {
        setInternalSelectedValues(newSelectedValues);
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex min-h-8 w-full cursor-default items-center justify-between rounded-md border bg-white p-1",
              className,
              `${isPopoverOpen ? "border-bg-green-300 hover:border-bg-green-300" : ""}`,
              `${selectedValues.length == 0 ? "max-h-6" : ""}`,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    return (
                      <Badge
                        key={value}
                        className={cn(multiSelectVariants({ variant }))}
                      >
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value);
                          }}
                          className="cursor-pointer"
                        >
                          <X variant={variant ?? undefined} />
                        </div>
                        {option?.label}
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <p>{`+ ${selectedValues.length - maxCount} more`}</p>
                  )}
                </div>
                <div className="ml-2 flex-shrink-0">
                  <ChevronDown
                    className={`h-4 w-4 cursor-pointer transition-all ${isPopoverOpen ? "rotate-270" : "rotate-90"}`}
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-2 truncate text-dark-gray-100">
                  {placeholder}
                </span>
                <div className="ml-2 flex-shrink-0">
                  <ChevronDown
                    className={`h-4 w-4 cursor-pointer transition-all ${isPopoverOpen ? "rotate-270" : "rotate-90"}`}
                  />
                </div>
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[var(--radix-popover-trigger-width)] border-[1px] border-light-green bg-white p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className="cursor-pointer rounded-lg hover:bg-mint-200"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border border-dark-green",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className="h-4 w-4 rounded-[4px] bg-dark-green text-white" />
                      </div>
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
