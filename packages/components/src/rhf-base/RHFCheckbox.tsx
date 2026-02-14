import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import Checkbox from "../base/Checkbox";

interface RHFCheckboxProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  id: string;
  required?: boolean;
  errorText?: string;
}

export default function RHFCheckbox<TFieldValues extends FieldValues>({
  rhfName,
  ...checkboxProps
}: RHFCheckboxProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...checkboxProps}
          checked={field.value ?? false}
          onCheckedChange={field.onChange}
        />
      )}
    />
  );
}
