import { Label } from "@good-dog/ui/label";
import {
  RadioGroupItem,
  RadioGroup as RadioGroupShad,
} from "@good-dog/ui/radio-group";

import ErrorExclamation from "../svg/ErrorExclamation";

interface RadioGroupProps {
  options: {
    value: string;
    label: string;
  }[];
  htmlFor?: string;
  label: string;
  required: boolean;
  errorText?: string;
}

export default function RadioGroup({
  options,
  htmlFor,
  label,
  required,
  errorText,
}: RadioGroupProps) {
  return (
    <div className="flex w-full flex-col gap-2 text-label-black">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={htmlFor} className="!text-base-label">
          {label}
        </Label>
        {required && (
          <Label className="!text-base-label text-required-star">*</Label>
        )}
      </div>
      <RadioGroupShad
        required={required}
        className="flex w-full flex-col gap-5"
      >
        {options.map((option, index) => {
          return (
            <div key={index} className="flex w-full flex-row gap-2">
              <RadioGroupItem
                className={`border-radio ${errorText ? "border-error-border shadow-error-shadow" : ""}`}
                value={option.value}
              />
              <Label htmlFor={htmlFor} className="!text-base-label">
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroupShad>
      {errorText && (
        <div className="flex flex-row gap-[2px]">
          <ErrorExclamation />
          <Label className="!text-base-helper text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
