import type { FieldValues, Path } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import Dropdown from "../base/Dropdown";

interface RHFDropdownProps<TFieldValues extends FieldValues> {
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
  arrow?: boolean;
}

export default function RHFDropdown<TFieldValues extends FieldValues>({
  rhfName,
  ...dropdownProps
}: RHFDropdownProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={rhfName}
      control={control}
      render={({ field }) => (
        <Dropdown
          {...dropdownProps}
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}
