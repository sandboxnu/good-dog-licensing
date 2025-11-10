"use client";

import { Label } from "@good-dog/ui/label";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@good-dog/ui/select";
import { useFormContext } from "react-hook-form";

interface MultiselectDropdownProps {
  label: string;
  rhfName: string; // 👈 new: connect to RHF
  options: {
    label: string;
    value: string;
  }[];
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
}

/**
 * RHF-compatible SingleDropdown
 */
export default function RHFSingleDropdown({
  label,
  rhfName,
  options,
  placeholder,
  id,
  variant,
  maxCount,
  required = false,
  helperText,
}: MultiselectDropdownProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(rhfName);
  const errorText = errors[rhfName]?.message as string | undefined;

  return (
    <div className="w-full flex flex-col gap-[4px]">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={id} className="text-body3 text-[#171717] font-normal">
          {label}
        </Label>
        {required && (
          <Label className="text-body3 text-required-star font-normal">*</Label>
        )}
      </div>

      <Select
        value={value ?? ""}
        onValueChange={(val) =>
          setValue(rhfName, val, { shouldValidate: true })
        }
      >
        <SelectTrigger
          id={id}
          className={clsx(
            "w-[180px] bg-gray-100 border-dark-gray-200 h-[32px] rounded-lg",
            {
              "!border-error !shadow-error": errorText,
            },
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {helperText && !errorText && (
        <Label className="text-caption text-[#171717]">{helperText}</Label>
      )}
      {errorText && (
        <div className="flex flex-row gap-[2px] items-center">
          <ErrorExclamation />
          <Label className="text-caption text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
