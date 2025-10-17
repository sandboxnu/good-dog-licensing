import clsx from "clsx";

import { Label } from "@good-dog/ui/label";
import { Textarea } from "@good-dog/ui/textarea";

import ErrorExclamation from "../svg/ErrorExclamation";

interface TextAreaProps {
  label: string;
  placeholder: string;
  htmlFor?: string;
  required: boolean;
  helperText?: string;
  errorText?: string;
}

export default function TextArea({
  label,
  placeholder,
  htmlFor,
  required = false,
  helperText,
  errorText,
}: TextAreaProps) {
  return (
    <div className="flex w-full flex-col gap-label-input-sep text-label-black">
      <div className="flex flex-row gap-[2px]">
        <Label htmlFor={htmlFor} className="!text-base-label">
          {label}
        </Label>
        {required && (
          <Label className="!text-base-label text-required-star">*</Label>
        )}
      </div>
      <Textarea
        className={clsx(
          "h-textarea w-full rounded-base-input border-inactive-border py-2 pl-placeholder-sep text-base-input text-input-black",
          "placeholder:text-placeholder",
          "hover:border-hover-border",
          "focus:border-active-border focus:shadow-active-shadow focus:outline-none",
          {
            "!border-error-border !shadow-error-shadow": errorText,
          },
        )}
        placeholder={placeholder}
      />
      {helperText && !errorText && (
        <Label className="!text-base-helper text-label-black">
          {helperText}
        </Label>
      )}
      {errorText && (
        <div className="flex flex-row gap-[2px]">
          <ErrorExclamation />
          <Label className="!text-base-helper text-error">{errorText}</Label>
        </div>
      )}
    </div>
  );
}
