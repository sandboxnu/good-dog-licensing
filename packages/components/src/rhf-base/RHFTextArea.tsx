import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import type { TextAreaProps } from "../base/TextArea";
import TextArea from "../base/TextArea";

interface RHFTextAreaProps<TFieldValues extends FieldValues>
  extends TextAreaProps {
  rhfName: Path<TFieldValues>;
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
