import Check from "../svg/status-icons/Check";
import ClockFull from "../svg/status-icons/ClockFull";
import ErrorExclamation from "../svg/status-icons/ErrorExclamation";
import Hourglass from "../svg/status-icons/Hourglass";
import type { Status } from "../../utils/status";
import {
  getMatchStateLabel,
  getStatusLabel,
} from "../../utils/enumLabelMapper";
import { MatchState } from "@good-dog/db";

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

// DUPLICATE CODE IN StatusIndicator
const getColorFromVariant = (variant: Variant) => {
  switch (variant) {
    case "success":
      return "bg-grass-green-50 dark:bg-grass-green-600 text-grass-green-500 dark:text-grass-green-100 border-[0.5px] border-grass-green-500 dark:border-grass-green-100";
    case "error":
      return "bg-red-50 dark:bg-red-600 text-red-400 dark:text-red-100 border-[0.5px] border-red-600 dark:border-red-400";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-600 text-yellow-500 dark:text-yellow-200 border-[0.5px] border-yellow-500 dark:border-yellow-200";
    case "gray":
      return "bg-gray-300 dark:bg-gray-500 text-gray-500 dark:text-gray-300 border-[0.5px] border-gray-400 dark:border-dark-gray-200";
    case "blue":
      return "bg-blue-50 text-blue-500 dark:bg-blue-600 dark:text-blue-100 border-[0.5px] border-blue-500 dark:border-blue-100";
  }
};

export default function StatusIndicator({
  admModStatus,
  matchState: matchState,
}: {
  admModStatus: Status;
  matchState: MatchState;
}) {
  const variant = getVariant(admModStatus);
  const showDetails =
    admModStatus === "IN_PROGRESS" || admModStatus == "REJECTED";

  return (
    <div className="flex flex-row items-center gap-2">
      {showDetails && (
        <p
          className={`text-base ${getColorFromVariant(variant)} !bg-transparent !border-none`}
        >
          {getStatusLabel(admModStatus)}
        </p>
      )}
      <div
        className={`flex-shrink-0 align-center flex h-[24px] w-fit items-center justify-center gap-[4px] pb-[4px] pl-[8px] pr-[8px] pt-[4px] rounded-sm ${getColorFromVariant(variant)}`}
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
          <p className={`body3 ${getColorFromVariant(variant)} !border-none`}>
            {getMatchStateLabel(matchState)}
          </p>
        </div>
      </div>
    </div>
  );
}
