import { Checkbox as CheckboxShad } from "@good-dog/ui/checkbox";
import { Label } from "@good-dog/ui/label";

import ErrorExclamation from "../svg/status-icons/ErrorExclamation";

interface CheckboxProps {
  label: string;
  id: string;
  required?: boolean;
  errorText?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function Checkbox({
  label,
  id,
  required = false,
  errorText,
  checked = false,
  onCheckedChange,
}: CheckboxProps) {
  return (
    <div className="flex w-full flex-col gap-2 text-black dark:text-white">
      <div className="flex w-full flex-row items-center gap-2">
        <CheckboxShad
          required={required}
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`border-green-400 dark:border-green-100 text-white dark:text-green-600 data-[state=checked]:bg-green-400 dark:data-[state=checked]:bg-mint-300 ${errorText ? "border-red-400 shadow-red-400" : ""}`}
        />
        <div className="flex flex-row items-center gap-[2px]">
          <Label className="text-body3" htmlFor={id}>
            {label}
          </Label>
          {required && (
            <Label className="text-body3 text-required-star">*</Label>
          )}
        </div>
      </div>
      {errorText && (
        <div className="flex flex-row items-center gap-[2px]">
          <ErrorExclamation size="small" />
          <Label className="text-caption text-red-400">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
