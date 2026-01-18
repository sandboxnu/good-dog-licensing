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
          ? "bg-red-400 hover:bg-[#852726] active:bg-[#591A1A]"
          : ""
      } ${errorOutlined ? "border-error active:bg-[#852726] hover:bg-red-200" : ""}`}
    >
      <div
        className={`flex flex-row items-center justify-center gap-[8px] ${
          errorContained ? "text-white" : ""
        } ${
          errorOutlined
            ? "text-error group-hover:text-[#591A1A] group-active:text-white"
            : ""
        }`}
      >
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
