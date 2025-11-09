import { Input } from "@good-dog/ui/input";
import { Label } from "@good-dog/ui/label";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import clsx from "clsx";
import { ReactNode } from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  id: string;
  type?: "password";
  required?: boolean;
  helperText?: string;
  errorText?: string;
  icon?: ReactNode;
}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  id,
  type,
  required = false,
  helperText,
  errorText,
  icon
}: TextInputProps) {
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
      <Input
        className={clsx(
          "w-full h-[32px] pl-[8px] text-body3 text-body-primary rounded-[8px] border-[#858585]",
          "placeholder:text-[#ADADAD]",
          "hover:border-[#404040]",
          "focus:border-[#098465] focus:shadow-active focus:outline-none",
          {
            "!border-error !shadow-error": errorText,
          },
        )}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        icon={icon}
      />
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
