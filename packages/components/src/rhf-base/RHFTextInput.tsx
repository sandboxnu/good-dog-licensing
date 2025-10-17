import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import type { TextInputProps } from "../base/TextInput";
import TextInput from "../base/TextInput";

interface RHFTextInputProps<TFieldValues extends FieldValues>
  extends TextInputProps {
  rhfName: Path<TFieldValues>;
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
