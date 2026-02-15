import clsx from "clsx";

import { Label } from "@good-dog/ui/label";
import { Textarea } from "@good-dog/ui/textarea";

import ErrorExclamation from "../svg/status-icons/ErrorExclamation";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  id: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  required = false,
  helperText,
  errorText,
}: TextInputProps) {
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
      <Textarea
        className={clsx(
          "h-[80px] w-full rounded-[8px] border-dark-gray-200 dark:border-dark-gray-300 pl-[8px] text-body3 text-dark-gray-500 dark:text-gray-200 dark:bg-dark-gray-500",
          "placeholder:text-dark-gray-100",
          "hover:border-gray-600",
          "focus:border-bg-green-300 focus:shadow-active focus:outline-none",
          {
            "!border-red-400 !shadow-red-400 !dark:border-red-300 !dark:shadow-red-300":
              errorText,
          },
        )}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
