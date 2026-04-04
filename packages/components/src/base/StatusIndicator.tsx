import Check from "../svg/status-icons/Check";
import ClockFull from "../svg/status-icons/ClockFull";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import Hourglass from "../svg/status-icons/Hourglass";
import type { Status } from "../../utils/status";
import { getStatusLabel } from "../../utils/enumLabelMapper";

type Variant = "success" | "error" | "warning" | "gray" | "blue";

const getVariant = (status: Status): Variant => {
  switch (status) {
    case "ACTION_NEEDED":
      return "error";
    case "APPROVAL_NEEDED":
      return "error";
    case "SUGGESTIONS_NEEDED":
      return "error";
    case "SONG_SUBMITTED":
      return "success";
    case "COMPLETED":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    case "REJECTED":
      return "gray";
    case "HIDDEN":
      return "gray";
  }
};

const getColorFromVariant = (variant: Variant) => {
  switch (variant) {
    case "success":
      return "bg-grass-green-50 dark:bg-grass-green-400 text-grass-green-500 dark:text-grass-green-50";
    case "error":
      return "bg-red-50 dark:bg-red-400 text-red-400 dark:text-red-50";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-100";
    case "gray":
      return "bg-gray-300 text-gray-500";
    case "blue":
      return "bg-blue-50 text-blue-500 dark:bg-blue-300 dark:text-blue-50";
  }
};

export default function StatusIndicator({ status }: { status: Status }) {
  const variant = getVariant(status);

  return (
    <div
      className={`flex-shrink-0 align-center flex h-[24px] w-fit items-center justify-center gap-[4px] rounded pb-[4px] pl-[8px] pr-[8px] pt-[4px] ${getColorFromVariant(variant)}`}
    >
      <div className="flex flex-row items-center gap-[4px]">
        {variant === "success" ? (
          <Check />
        ) : variant === "error" ? (
          <ErrorExclamation size="medium" />
        ) : variant === "warning" ? (
          <ClockFull />
        ) : variant === "blue" ? (
          <Hourglass />
        ) : (
          <></>
        )}
        <p className={`body3 ${getColorFromVariant(variant)}`}>
          {getStatusLabel(status)}
        </p>
      </div>
    </div>
  );
}
