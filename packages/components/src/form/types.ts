import type { FieldValues, Path } from "react-hook-form";

export interface GoodDogFieldBaseProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: React.ReactNode | string;
  required?: boolean;
  placeholder?: string;
}
