import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import TextInput from "../base/TextInput";

interface RHFTextInputProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  placeholder: string;
  id: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
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
