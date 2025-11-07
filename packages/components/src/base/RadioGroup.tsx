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
    <div className="w-full flex flex-col text-black gap-[0px]">
      <div className="flex flex-row gap-[2px]">
        <Label className="text-body3">{label}</Label>
        {required && <Label className="text-body3 text-required-star">*</Label>}
      </div>
      <RadioGroupShad
        required={required}
        className="w-full flex flex-col gap-[0px]"
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className="w-full flex flex-row gap-2 items-center"
            >
              <RadioGroupItem
                className={`border-good-dog-main ${errorText ? " border-error shadow-error" : ""}`}
                value={option.value}
                id={`${id}-${index}`}
              />
              <Label htmlFor={`${id}-${index}`} className="text-body3">
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroupShad>
      {errorText && (
        <div className="flex flex-row gap-[2px] items-center">
          <ErrorExclamation />
          <Label className="text-caption text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
