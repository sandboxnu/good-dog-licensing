import { Label } from "@good-dog/ui/label";
import ErrorExclamation from "../svg/ErrorExclamation";
import clsx from "clsx";
import { MultiSelect } from "@good-dog/ui/multi-select";

interface MultiselectDropdownProps {
  label: string;
  value: string;
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
    <div className="w-full flex flex-col gap-[4px]">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={id} className="text-body3 text-[#171717] font-normal">
          {label}
        </Label>
        {required && (
          <Label className="text-body3 text-required-star font-normal">*</Label>
        )}
      </div>
      <MultiSelect
        className={clsx(
          "w-full min-h-[32px] text-body3 text-body-primary rounded-[8px] border-[#858585] hover:border-[#404040]",
          {
            "!border-error !shadow-error": errorText,
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
