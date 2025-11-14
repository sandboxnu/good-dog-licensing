import Check from "../svg/status-icons/Check";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import ClockFull from "../svg/status-icons/ClockFull";
import Hourglass from "../svg/status-icons/Hourglass";

export default function StatusIndicator({
  variant,
  text,
}: {
  variant: "success" | "error" | "warning" | "gray" | "blue";
  text: string;
}) {
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

  return (
    <div
      className={`flex h-[24px] gap-[4px] pt-[4px] pb-[4px] pr-[8px] pl-[8px]  w-fit justify-center items-center align-center rounded ${getColorFromVariant(variant)}`}
    >
      <div className="flex flex-row gap-[4px] items-center">
        {variant === "success" ? (
          <Check />
        ) : variant === "error" ? (
          <ErrorExclamation size={"small"} />
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
