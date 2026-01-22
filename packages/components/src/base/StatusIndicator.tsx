import Check from "../svg/status-icons/Check";
import ClockFull from "../svg/status-icons/ClockFull";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import Hourglass from "../svg/status-icons/Hourglass";

const getColorFromVariant = (
  variant: "success" | "error" | "warning" | "gray" | "blue",
) => {
  switch (variant) {
    case "success":
      return "bg-grass-green-50 dark:bg-grass-green-400 text-grass-green-500 dark:text-grass-green-50";
    case "error":
      return "bg-red-50 dark:bg-red-400 text-red-400 dark:text-red-50";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-100";
    case "gray":
      return "bg-gray-400 text-gray-600";
    case "blue":
      return "bg-blue-50 text-blue-500 dark:bg-blue-300 dark:text-blue-50";
  }
};

export interface StatusIndicatorType {
  variant: "success" | "error" | "warning" | "gray" | "blue";
  text: string;
}

export default function StatusIndicator({
  variant,
  text,
}: StatusIndicatorType) {
  return (
    <div
      className={`flex-shrink-0 align-center flex h-[24px] w-fit items-center justify-center gap-[4px] rounded pb-[4px] pl-[8px] pr-[8px] pt-[4px] ${getColorFromVariant(variant)}`}
    >
      <div className="flex flex-row items-center gap-[4px]">
        {variant === "success" ? (
          <Check />
        ) : variant === "error" ? (
          <ErrorExclamation size={"small"} dark={false} />
        ) : variant === "warning" ? (
          <ClockFull />
        ) : variant === "blue" ? (
          <Hourglass />
        ) : (
          <></>
        )}
        <p className={`body3 ${getColorFromVariant(variant)}`}>{text}</p>
      </div>
    </div>
  );
}
