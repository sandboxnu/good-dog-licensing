import { Label } from "@good-dog/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@good-dog/ui/dropdown-menu";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
          className="text-body3 font-normal text-dark-gray-600"
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
          className="h-[32px] w-full rounded-[8px] border border-gray px-2 text-body3 text-body-primary placeholder:text-dark-gray-100 hover:border-gray-600 focus:border-green-300 focus:shadow-active focus:outline-none"
        >
          <div className="flex justify-between items-center">
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
          className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg bg-white py-2 space-y-1"
          align="start"
          sideOffset={4}
        >
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onChange(option.value)}
                className={`flex items-center justify-between text-[16px] rounded-lg text-body3 focus:bg-[#E6F4F0] ${
                  isSelected ? "bg-[#E6F4F0]" : ""
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
