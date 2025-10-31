import { Button as ButtonShad } from "@good-dog/ui/button";
import AddIcon from "../svg/AddIcon";

interface ButtonProps {
  label?: string;
  size: "medium" | "large";
  variant: "contained" | "outlined" | "text";
  onClick?: () => void;
  displayIcon?: "plus" | "arrow";
  shadow?: boolean;
  fullWidth?: boolean;
  type?: "submit" | "button";
}

type sizeOptions =
  | "medium-text"
  | "large-text"
  | "medium-text-with-icon"
  | "large-text-with-icon"
  | "medium-icon"
  | "large-icon";

export default function Button({
  label,
  size,
  variant,
  onClick,
  type,
  displayIcon,
  shadow = false,
  fullWidth = false,
}: ButtonProps) {
  const updatedSize: sizeOptions =
    label && displayIcon
      ? `${size}-text-with-icon`
      : label
        ? `${size}-text`
        : `${size}-icon`;

  const widthClassName = fullWidth ? "!w-full" : "";
  const shadowClassName = shadow ? "shadow-button" : "";

  return (
    <ButtonShad
      variant={variant}
      size={updatedSize}
      type={type}
      onClick={onClick}
      className={`${widthClassName} ${shadowClassName}`}
    >
      <div className="flex flex-row gap-[8px] items-center justify-center">
        {displayIcon && (
          <AddIcon
            color={variant === "contained" ? "light" : "dark"}
            size={size}
          />
        )}
        {label}
      </div>
    </ButtonShad>
  );
}
