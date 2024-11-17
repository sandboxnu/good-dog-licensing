"use client";

import type { HTMLInputTypeAttribute } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Input } from "@good-dog/ui/input";

export default function RegistrationInput<Values extends FieldValues>(
  props: Readonly<{
    fieldName: FieldPath<Values>;
    placeholder?: string;
    type: HTMLInputTypeAttribute;
  }>,
) {
  const { register, formState } = useFormContext<Values>();
  const errors = formState.errors[props.fieldName];

  return (
    <div>
      <Input
        {...register(props.fieldName)}
        placeholder={props.placeholder}
        type={props.type}
      />
      {typeof errors?.message === "string" && (
        <p className="text-red-500">{errors.message}</p>
      )}
    </div>
  );
}
