import clsx from "clsx";

import { Input } from "@good-dog/ui/input";
import { Label } from "@good-dog/ui/label";

import ErrorExclamation from "../svg/ErrorExclamation";

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  id?: string;
  required: boolean;
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
    <div className="flex w-full flex-col gap-label-input-sep text-label-black">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={id} className="!text-base-label">
          {label}
        </Label>
        {required && (
          <Label className="!text-base-label text-required-star">*</Label>
        )}
      </div>
      <Input
        className={clsx(
          "h-base-input w-full rounded-base-input border-inactive-border pl-placeholder-sep text-base-input text-input-black",
          "placeholder:text-placeholder",
          "hover:border-hover-border",
          "focus:border-active-border focus:shadow-active-shadow focus:outline-none",
          {
            "!border-error-border !shadow-error-shadow": errorText,
          },
        )}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {helperText && !errorText && (
        <Label className="!text-base-helper text-label-black">
          {helperText}
        </Label>
      )}
      {errorText && (
        <div className="flex flex-row gap-[2px]">
          <ErrorExclamation />
          <Label className="!text-base-helper text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
