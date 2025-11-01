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

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "flex flex-row gap-1 text-body3 my-0.5 border-[1px] h-6",
  {
    variants: {
      variant: {
        standard:
          "!text-good-dog-main bg-[#D3F4E2] border-good-dog-main rounded-lg",
        hover:
          "!text-[#D3F4E2] bg-good-dog-main border-good-dog-main rounded-lg",
        inactive: "!text-[#5C5C5C] bg-white border-[#5C5C5C] rounded-lg",
        round_standard:
          "!text-good-dog-main bg-[#D3F4E2] border-good-dog-main rounded-2xl",
        round_hover:
          "!text-[#D3F4E2] bg-good-dog-main border-good-dog-main rounded-2xl",
        round_inactive: "!text-[#5C5C5C] bg-white border-[#5C5C5C] rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  },
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
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
      defaultValue = [],
      placeholder = "Select options",
      maxCount = 3,
      modalPopover = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
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
              "flex min-h-8 w-full items-center justify-between rounded-md border bg-white p-1 cursor-default",
              className,
              `${isPopoverOpen ? "border-[#098465] hover:border-[#098465]" : ""}`,
              `${selectedValues.length == 0 ? "max-h-6" : ""}`,
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex-1 min-w-0 flex flex-wrap gap-2 items-center">
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
                <div className="flex-shrink-0 ml-2">
                  <ChevronDown
                    className={`h-4 w-4 cursor-pointer transition-all ${isPopoverOpen ? "rotate-270" : "rotate-90"}`}
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full items-center justify-between">
                <span className="mx-2 text-[#ADADAD] truncate">
                  {placeholder}
                </span>
                <div className="flex-shrink-0 ml-2">
                  <ChevronDown
                    className={`h-4 w-4 cursor-pointer transition-all ${isPopoverOpen ? "rotate-270" : "rotate-90"}`}
                  />
                </div>
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0 bg-white border-[1px] border-light-green"
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
                      className="cursor-pointer hover:bg-[#E9F9F1] rounded-lg"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-[4px] border border-dark-green",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className="h-4 w-4 bg-dark-green text-white rounded-[4px]" />
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
