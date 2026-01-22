import clsx from "clsx";

import { Label } from "@good-dog/ui/label";
import { MultiSelect } from "@good-dog/ui/multi-select";

import ErrorExclamation from "../svg/status-icons/ErrorExclamation";

interface MultiselectDropdownProps {
  label: string;
  value: string[];
  options: {
    label: string;
    value: string;
  }[];
  onChange: (newValue: string[]) => void;
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
}

export default function MultiselectDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  id,
  variant,
  maxCount,
  required = false,
  helperText,
  errorText,
}: MultiselectDropdownProps) {
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
      <MultiSelect
        className={clsx(
          "min-h-[32px] w-full rounded-[8px] border-dark-gray-200 text-body3 text-dark-gray-500 dark:text-gray-200 dark:bg-dark-gray-500 hover:border-gray-600",
          {
            "!border-red-400 !shadow-red-400 !dark:border-red-300 !dark:shadow-red-300":
              errorText,
          },
        )}
        placeholder={placeholder}
        id={id}
        value={value}
        onValueChange={onChange}
        options={options}
        variant={variant}
        maxCount={maxCount}
      />
      {helperText && !errorText && (
        <Label className="text-caption text-dark-gray-600">{helperText}</Label>
      )}
      {errorText && (
        <div className="flex flex-row items-center gap-[2px]">
          <ErrorExclamation size="small" dark={true} />
          <Label className="text-caption text-red-400 dark:text-red-300">
            {errorText}
          </Label>
        </div>
      )}
    </div>
  );
}
