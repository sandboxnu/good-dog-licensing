"use client";

import type { HTMLInputTypeAttribute } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { Input } from "@good-dog/ui/input";

export default function RegistrationInput<Values extends FieldValues>(
  props: Readonly<{
    fieldName: FieldPath<Values>;
    placeholder?: string;
    label: string;
    type: HTMLInputTypeAttribute;
    classname?: string;
  }>,
) {
  const { register, formState } = useFormContext<Values>();
  const errors = formState.errors[props.fieldName];

  return (
    <div className={props.classname}>
      <label htmlFor={props.fieldName} className="mb-4">
        {props.label}
      </label>
      <Input
        id={props.fieldName}
        {...register(props.fieldName)}
        className="border-good-dog-violet bg-white file:bg-white"
        placeholder={props.placeholder}
        type={props.type}
      />
      {typeof errors?.message === "string" && (
        <p className="text-good-dog-error">{errors.message}</p>
      )}
    </div>
  );
}
