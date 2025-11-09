import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import TextInput from "../base/TextInput";
import { ReactNode } from "react";

interface RHFTextInputProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  placeholder: string;
  id: string;
  type?: "password";
  required?: boolean;
  helperText?: string;
  errorText?: string;
  icon?: ReactNode;
}

export default function RHFTextInput<TFieldValues extends FieldValues>({
  rhfName,
  ...textInputProps
}: RHFTextInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <TextInput
          {...textInputProps}
          value={field.value || ""}
          onChange={field.onChange}
        />
      )}
    />
  );
}
