import { Button as ButtonShad } from "@good-dog/ui/button";

interface ButtonProps {
  label?: string;
  size: "medium" | "large";
  type: "contained" | "outlined" | "text";
  displayIcon?: boolean;
  shadow?: boolean;
}

export default function Button({
  label,
  size,
  type,
  displayIcon = false,
  shadow = false,
}: ButtonProps) {
  return (
    <ButtonShad variant={type} size={size}>
      {label}
    </ButtonShad>
  );
}
