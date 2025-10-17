import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import type { TextInputProps } from "../base/TextInput";
import TextInput from "../base/TextInput";

interface RHFTextInputProps<TFieldValues extends FieldValues>
  extends TextInputProps {
  rhfName: Path<TFieldValues>;
}

export default function RHFTextInput<TFieldValues extends FieldValues>(
  props: RHFTextInputProps<TFieldValues>,
) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={props.rhfName}
      control={control}
      render={({ field }) => (
        <TextInput
          {...props}
          value={field.value || ""}
          onChange={field.onChange}
        />
      )}
    />
  );
}
