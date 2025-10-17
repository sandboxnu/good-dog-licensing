import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import TextInput from "../base/TextInput";

interface RHFTextInputProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  placeholder: string;
  id?: string;
  required: boolean;
  helperText?: string;
  errorText?: string;
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
