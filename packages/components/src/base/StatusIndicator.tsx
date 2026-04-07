import type { Status } from "../../utils/status";
import { getStatusLabel } from "../../utils/enumLabelMapper";
import Check from "../svg/status-icons/Check";
import ClockFull from "../svg/status-icons/ClockFull";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import Hourglass from "../svg/status-icons/Hourglass";
import type { MatchState } from "@good-dog/db";

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

const getColorFromVariant = (variant: Variant, borders?: boolean) => {
  const b = borders ? "border border-[0.5px]" : "";
  switch (variant) {
    case "success":
      return `bg-grass-green-50 dark:bg-grass-green-400 text-grass-green-500 dark:text-grass-green-50 ${b && `${b} border-grass-green-500 dark:border-grass-green-100}`}`;
    case "error":
      return `bg-red-50 dark:bg-red-400 text-red-400 dark:text-red-50 ${b && `${b} border-red-600 dark:border-red-400`}`;
    case "warning":
      return `bg-yellow-100 dark:bg-yellow-400 text-yellow-500 dark:text-yellow-100 ${b && `${b} border-yellow-500 dark:border-yellow-200`}}`;
    case "gray":
      return `bg-gray-300 text-gray-500 ${b && `${b} border-gray-400 dark:border-dark-gray-200`}`;
    case "blue":
      return `bg-blue-50 text-blue-500 dark:bg-blue-300 dark:text-blue-50 ${b && `${b} border-blue-500 dark:border-blue-100`}`;
  }
};

export default function StatusIndicator({
  status,
  details,
}: {
  status: Status;
  details?: MatchState;
}) {
  const variant = getVariant(status);

  const toSentenceCase = (str: string): string => {
    const lower = str.replace(/_/g, " ").toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <div
        className={`flex-shrink-0 align-center flex min-h-[24px] w-fit items-center justify-center rounded gap-[4px] pb-[4px] pl-[8px] pr-[8px] pt-[4px] ${getColorFromVariant(variant)}`}
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
      {details && (
        <div className={`px-2 rounded ${getColorFromVariant(variant, true)}`}>
          {toSentenceCase(details)}
        </div>
      )}
    </div>
  );
}
