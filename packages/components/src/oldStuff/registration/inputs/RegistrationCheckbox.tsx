"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox } from "@good-dog/ui/checkbox";
import { Label } from "@good-dog/ui/label";

export default function RegistrationCheckbox<Values extends FieldValues>(
  props: Readonly<{
    fieldName: FieldPath<Values>;
    label: string;
  }>,
) {
  const { control, formState } = useFormContext<Values>();
  const errors = formState.errors[props.fieldName];

  return (
    <div className="flex flex-row">
      <Controller
        name={props.fieldName}
        control={control}
        render={({ field }) => (
          <Checkbox
            className="mr-2 bg-white"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Label htmlFor={props.fieldName}>{props.label}</Label>
      {typeof errors?.message === "string" && (
        <p className="text-good-dog-error">{errors.message}</p>
      )}
    </div>
  );
}
