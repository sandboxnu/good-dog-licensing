import { Label } from "@good-dog/ui/label";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
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
    <div className="flex w-full flex-col gap-[4px]">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={id} className="text-body3 font-normal text-[#171717]">
          {label}
        </Label>
        {required && (
          <Label className="text-body3 font-normal text-required-star">*</Label>
        )}
      </div>
      <MultiSelect
        className={clsx(
          "min-h-[32px] w-full rounded-[8px] border-[#858585] text-body3 text-body-primary hover:border-[#404040]",
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
        <div className="flex flex-row items-center gap-[2px]">
          <ErrorExclamation size="small" />
          <Label className="text-caption text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
