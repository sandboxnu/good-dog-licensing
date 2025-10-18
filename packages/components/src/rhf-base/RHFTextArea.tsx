import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "../base/TextArea";

interface RHFTextAreaProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  placeholder: string;
  id: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
}

export default function RHFTextArea<TFieldValues extends FieldValues>({
  rhfName,
  ...textAreaProps
}: RHFTextAreaProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <TextArea
          {...textAreaProps}
          value={field.value || ""}
          onChange={field.onChange}
        />
      )}
    />
  );
}
