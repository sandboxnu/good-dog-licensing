import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import RadioGroup from "../base/RadioGroup";

interface RHFRadioGroupProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  options: {
    value: string;
    label: string;
  }[];
  id: string;
  label: string;
  required?: boolean;
  errorText?: string;
}

export default function RHFRadioGroup<TFieldValues extends FieldValues>({
  rhfName,
  ...radioGroupProps
}: RHFRadioGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <RadioGroup
          {...radioGroupProps}
          value={field.value || ""}
          onValueChange={field.onChange}
        />
      )}
    />
  );
}
