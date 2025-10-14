import { Label } from "@good-dog/ui/label";
import { Checkbox as CheckboxShad } from "@good-dog/ui/checkbox";
import ErrorExclamation from "../svg/ErrorExclamation";

interface CheckboxProps {
  label: string;
  htmlFor?: string;
  required: boolean;
  errorText?: string;
}

export default function Checkbox({
  label,
  htmlFor,
  required = false,
  errorText,
}: CheckboxProps) {
  return (
    <div className="w-full flex flex-col gap-2 text-label-black">
      <div className="w-full flex flex-row gap-2">
        <CheckboxShad
          className={`border-checkbox data-[state=checked]:bg-checkbox ${errorText ? " data-[state=unchecked]:border-error-border data-[state=unchecked]:shadow-error-shadow" : ""}`}
        />
        <div className="flex flex-row gap-[2px]">
          <Label htmlFor={htmlFor} className="!text-base-label">
            {label}
          </Label>
          {required && (
            <Label className="!text-base-label text-required-star">*</Label>
          )}
        </div>
      </div>
      {errorText && (
        <div className="flex flex-row gap-[2px]">
          <ErrorExclamation />
          <Label className="!text-base-helper text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
