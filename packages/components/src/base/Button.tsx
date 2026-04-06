import { Check, ChevronUp, X } from "lucide-react";

import { Button as ButtonShad } from "@good-dog/ui/button";

import AddIcon from "../svg/AddIcon";
import PencilIcon from "../svg/PencilIcon";

interface ButtonProps {
  label?: string;
  size: "small" | "medium" | "large" | "flex";
  variant: "contained" | "outlined" | "text";
  onClick?: () => void;
  displayIcon?: "plus" | "arrow" | "pencil" | "check" | "close";
  shadow?: boolean;
  fullWidth?: boolean;
  type?: "submit" | "button";
  error?: boolean;
  disabled?: boolean;
}

type sizeOptions =
  | "small-text"
  | "medium-text"
  | "large-text"
  | "flex-text"
  | "medium-text-with-icon"
  | "small-text-with-icon"
  | "large-text-with-icon"
  | "flex-text-with-icon"
  | "small-icon"
  | "medium-icon"
  | "large-icon"
  | "flex-icon";

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
  disabled = false,
}: ButtonProps) {
  const updatedSize: sizeOptions =
    label && displayIcon
      ? `${size}-text-with-icon`
      : label
        ? `${size}-text`
        : `${size}-icon`;

  const widthClassName = fullWidth ? "!w-full" : "";
  const shadowClassName = shadow
    ? "shadow-button dark:shadow-grass-green-200"
    : "";

  const errorContained = error && variant === "contained";
  const errorOutlined = error && variant !== "contained";

  return (
    <ButtonShad
      disabled={disabled}
      variant={variant}
      size={updatedSize}
      type={type}
      onClick={onClick}
      className={`${widthClassName} ${shadowClassName} group ${
        errorContained
          ? "!bg-red-400 dark:active:bg-red-600 hover:!bg-red-500"
          : ""
      } ${errorOutlined ? "border-red-400 active:bg-500 hover:bg-red-200 dark:bg-dark-gray-600" : ""}`}
    >
      <div
        className={`flex flex-row items-center justify-center gap-[8px] ${
          errorContained ? "text-white" : ""
        } ${
          errorOutlined
            ? "text-red-400 dark:text-red-300 group-hover:text-red-600 group-active:text-white"
            : ""
        }`}
      >
        {displayIcon === "plus" ? (
          <AddIcon size={size} />
        ) : displayIcon === "arrow" ? (
          <ChevronUp />
        ) : displayIcon === "pencil" ? (
          <PencilIcon />
        ) : displayIcon === "check" ? (
          <Check />
        ) : displayIcon === "close" ? (
          <X className="h-4 w-4" />
        ) : null}
        {label}
      </div>
    </ButtonShad>
  );
}
