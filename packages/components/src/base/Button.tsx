import { Check, ChevronUp } from "lucide-react";

import { Button as ButtonShad } from "@good-dog/ui/button";

import AddIcon from "../svg/AddIcon";
import PencilIcon from "../svg/PencilIcon";

interface ButtonProps {
  label?: string;
  size: "small" | "medium" | "large";
  variant: "contained" | "outlined" | "text";
  onClick?: () => void;
  displayIcon?: "plus" | "arrow" | "pencil" | "check";
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
  const shadowClassName = shadow
    ? "shadow-button dark:shadow-grass-green-200"
    : "";

  const errorContained = error && variant === "contained";
  const errorOutlined = error && variant !== "contained";

  return (
    <ButtonShad
      variant={variant}
      size={updatedSize}
      type={type}
      onClick={onClick}
      className={`${widthClassName} ${shadowClassName} group ${
        errorContained
          ? "!bg-red-400 dark:active:bg-red-600 hover:!bg-red-500"
          : ""
      } ${errorOutlined ? "border-error active:bg-500 hover:bg-red-200 dark:bg-dark-gray-600" : ""}`}
    >
      <div
        className={`flex flex-row items-center justify-center gap-[8px] ${
          errorContained ? "text-white" : ""
        } ${
          errorOutlined
            ? "text-error group-hover:text-red-600 group-active:text-white"
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
        ) : null}
        {label}
      </div>
    </ButtonShad>
  );
}
