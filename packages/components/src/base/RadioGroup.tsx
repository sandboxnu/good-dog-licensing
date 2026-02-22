import { Label } from "@good-dog/ui/label";
import {
  RadioGroupItem,
  RadioGroup as RadioGroupShad,
} from "@good-dog/ui/radio-group";

import ErrorExclamation from "../svg/status-icons/ErrorExclamation";

interface RadioGroupProps {
  options: {
    value: string;
    label: string;
  }[];
  id: string;
  label: string;
  value: string;
  onValueChange: (newValue: string) => void;
  required?: boolean;
  errorText?: string;
}

export default function RadioGroup({
  options,
  id,
  label,
  value,
  onValueChange,
  required = false,
  errorText,
}: RadioGroupProps) {
  return (
    <div className="flex w-full flex-col gap-[0px] text-black">
      <div className="flex flex-row gap-[2px]">
        <Label className="text-body3 text-dark-gray-600 dark:text-gray-100">
          {label}
        </Label>
        {required && <Label className="text-body3 text-required-star">*</Label>}
      </div>
      <RadioGroupShad
        required={required}
        className="flex w-full flex-col gap-[0px]"
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className="flex w-full flex-row items-center gap-2"
            >
              <RadioGroupItem
                className={`border-green-400 text-green-400 dark:text-mint-300 ${errorText ? "border-red-400 shadow-red-400 dark:border-red-300 dark:shadow-red-300" : ""}`}
                value={option.value}
                id={`${id}-${index}`}
              />
              <Label
                htmlFor={`${id}-${index}`}
                className="text-body3 text-dark-gray-600 dark:text-gray-100"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroupShad>
      {errorText && (
        <div className="flex flex-row items-center gap-[2px]">
          <ErrorExclamation size="small" />
          <Label className="text-caption text-red-400 dark:text-red-300">
            {errorText}
          </Label>
        </div>
      )}
    </div>
  );
}
