import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import MultiselectDropdown from "../base/MultiselectDropdown";

interface RHFMultiselectDropdownProps<TFieldValues extends FieldValues> {
  rhfName: Path<TFieldValues>;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  placeholder: string;
  id: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  variant?:
    | "standard"
    | "hover"
    | "inactive"
    | "round_standard"
    | "round_hover"
    | "round_inactive";
}

export default function RHFMultiselectDropdown<
  TFieldValues extends FieldValues,
>({
  rhfName,
  ...multiselectDropdownProps
}: RHFMultiselectDropdownProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <MultiselectDropdown
          {...multiselectDropdownProps}
          value={field.value || []}
          onChange={field.onChange}
        />
      )}
    />
  );
}
