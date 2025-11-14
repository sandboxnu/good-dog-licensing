import clsx from "clsx";
import { Label } from "@good-dog/ui/label";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import { Textarea } from "@good-dog/ui/textarea";

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
        <Label htmlFor={id} className="text-body3 font-normal text-[#171717]">
          {label}
        </Label>
        {required && (
          <Label className="text-body3 font-normal text-required-star">*</Label>
        )}
      </div>
      <Textarea
        className={clsx(
          "h-[80px] w-full rounded-[8px] border-[#858585] pl-[8px] text-body3 text-body-primary",
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
      />
      {helperText && !errorText && (
        <Label className="text-caption text-[#171717]">{helperText}</Label>
      )}
      {errorText && (
        <div className="flex flex-row items-center gap-[2px]">
          <ErrorExclamation size="small" />
          <Label className="text-caption text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
