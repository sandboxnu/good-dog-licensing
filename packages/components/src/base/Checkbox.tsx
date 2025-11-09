import { Label } from "@good-dog/ui/label";
import { Checkbox as CheckboxShad } from "@good-dog/ui/checkbox";
import ErrorExclamation from "../svg/ErrorExclamation";

interface CheckboxProps {
  label: string;
  id: string;
  required?: boolean;
  errorText?: string;
}

export default function Checkbox({
  label,
  id,
  required = false,
  errorText,
}: CheckboxProps) {
  return (
    <div className="w-full flex flex-col gap-2 text-black">
      <div className="w-full flex flex-row gap-2 items-center">
        <CheckboxShad
          required={required}
          id={id}
          className={`border-good-dog-main data-[state=checked]:bg-good-dog-main ${errorText ? " border-error shadow-error" : ""}`}
        />
        <div className="flex flex-row gap-[2px] items-center">
          <Label className="text-body3" htmlFor={id}>
            {label}
          </Label>
          {required && (
            <Label className="text-body3 text-required-star">*</Label>
          )}
        </div>
      </div>
      {errorText && (
        <div className="flex flex-row gap-[2px] items-center">
          <ErrorExclamation size="small" />
          <Label className="text-caption text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
