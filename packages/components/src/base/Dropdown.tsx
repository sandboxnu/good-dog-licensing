import { useState } from "react";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@good-dog/ui/dropdown-menu";
import { Label } from "@good-dog/ui/label";

interface DropdownProps {
  label: string;
  value: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (newValue: string) => void;
  placeholder: string;
  id: string;
  variant?:
    | "standard"
    | "hover"
    | "inactive"
    | "round_standard"
    | "round_hover"
    | "round_inactive";
  maxCount?: number;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  arrow?: boolean;
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  id,
  required = false,
  arrow = false,
}: DropdownProps) {
  const currentLabel = value
    ? options.find((opt) => opt.value === value)?.label
    : placeholder;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-[4px]">
      <div className="flex flex-row gap-[2px]">
        <Label
          htmlFor={id}
          className="text-body3 font-normal text-dark-gray-600 dark:text-gray-100"
        >
          {label}
        </Label>
        {required && (
          <Label className="text-body3 font-normal text-required-star">*</Label>
        )}
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          asChild
          className="h-[32px] w-full rounded-[8px] border border-dark-gray-200 px-2 text-body3 text-dark-gray-500 placeholder:text-dark-gray-100 hover:border-gray-600 focus:border-green-300 focus:shadow-active focus:outline-none dark:border-dark-gray-300 dark:bg-dark-gray-500 dark:text-gray-200"
        >
          <div className="flex items-center justify-between">
            <span>{currentLabel}</span>
            {arrow &&
              (isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray" />
              ))}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] space-y-1 rounded-lg border border-dark-gray-200 bg-white py-2 text-body3 text-dark-gray-500 dark:border-dark-gray-300 dark:bg-dark-gray-500 dark:text-gray-200"
          align="start"
          sideOffset={4}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onChange(option.value)}
                className={`flex items-center justify-between rounded-lg text-[16px] text-body3 focus:bg-mint-300 dark:focus:bg-mint-500 ${
                  isSelected ? "bg-mint-300 dark:bg-mint-500" : ""
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <CheckIcon className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
