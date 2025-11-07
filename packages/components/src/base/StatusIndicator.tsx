import { ReactNode } from "react";
import Check from "../svg/status-icons/Check";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import ClockFull from "../svg/status-icons/ClockFull";

export default function StatusIndicator({
  variant,
  text,
}: {
  variant: "success" | "error" | "warning" | "gray";
  text: string;
}) {
  return (
    <div
      className="flex h-[24px] gap-[4px] pt-[4px] pb-[4px] pr-[8px] pl-[8px]  w-fit justify-center items-center align-center rounded"
      style={{ backgroundColor: `var(--badge-${variant})` }}
    >
      <div className="flex flex-row gap-[4px] items-center">
        {variant === "success" ? (
          <Check />
        ) : variant === "error" ? (
          <ErrorExclamation />
        ) : variant === "warning" ? (
          <ClockFull />
        ) : (
          <></>
        )}
        <p
          className={`body3`}
          style={{ color: `var(--badge-${variant}-icon-text)` }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
