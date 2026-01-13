import { ChevronUp } from "lucide-react";

import { Button as ButtonShad } from "@good-dog/ui/button";

import AddIcon from "../svg/AddIcon";
import PencilIcon from "../svg/PencilIcon";

interface ButtonProps {
  label?: string;
  size: "small" | "medium" | "large";
  variant: "contained" | "outlined" | "text";
  onClick?: () => void;
  displayIcon?: "plus" | "arrow" | "pencil";
  shadow?: boolean;
  fullWidth?: boolean;
  type?: "submit" | "button";
  error?: boolean;
}

type sizeOptions =
  | "small-text"
  | "medium-text"
  | "large-text"
  | "medium-text-with-icon"
  | "small-text-with-icon"
  | "large-text-with-icon"
  | "small-icon"
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
  error,
}: ButtonProps) {
  const updatedSize: sizeOptions =
    label && displayIcon
      ? `${size}-text-with-icon`
      : label
        ? `${size}-text`
        : `${size}-icon`;

  const widthClassName = fullWidth ? "!w-full" : "";
  const shadowClassName = shadow ? "shadow-button" : "";
  const divClassName = `flex flex-row items-center justify-center gap-[8px] ${
    error ? "text-error " : "" // adds text/border color if error
  }`.trim();

  return (
    <ButtonShad
      variant={variant}
      size={updatedSize}
      type={type}
      onClick={onClick}
      // TODO: not sure we have a color for this hover yet even in the figma so this is template
      className={`${widthClassName} ${shadowClassName} ${error ? "border-error hover:bg-red-50" : ""}`}
    >
      <div className={divClassName}>
        {displayIcon === "plus" ? (
          <AddIcon
            color={variant === "contained" ? "light" : "dark"}
            size={size}
          />
        ) : displayIcon === "arrow" ? (
          <ChevronUp />
        ) : displayIcon === "pencil" ? (
          <PencilIcon />
        ) : null}
        {label}
      </div>
    </ButtonShad>
  );
}
