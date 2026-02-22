"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import MusicNote from "../../svg/GreyMusicNote";
import {
  formatAllCapsList,
  formatAllCapsWord,
} from "../../../utils/allCapsListFormatter";
import Calendar from "../../svg/Calendar";
import { Link } from "lucide-react";
import User from "./User";
import FileIcon from "../../svg/FileIcon";
import Check from "../../svg/Check";
import StatusIndicator from "../../base/StatusIndicator";
import Group from "../../svg/Group";

type MatchType = GetProcedureOutput<"getSongRequestById">["matches"][number];

export default function MatchDrawer({
  match,
  open,
  onClose,
}: {
  match: MatchType | null;
  open: boolean;
  onClose: () => void;
}) {
  const getMatchStatus = (
    match?: { matchState: string } | null,
  ): {
    variant: "success" | "error" | "warning" | "gray" | "blue";
    text: string;
  } => {
    if (!match) {
      return { variant: "gray", text: "No Match" };
    }

    if (match.matchState === "APPROVED_BY_MUSICIAN") {
      return { variant: "success", text: "Complete" };
    }

    if (
      match.matchState === "SENT_TO_MEDIA_MAKER" ||
      match.matchState === "SENT_TO_MUSICIAN"
    ) {
      return { variant: "blue", text: "Awaiting Response" };
    }

    if (match.matchState === "WAITING_FOR_MANAGER_APPROVAL") {
      return { variant: "warning", text: "Awaiting Manager Approval" };
    }

    return { variant: "error", text: "Needs Attention" };
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-[30vw] px-9 py-12 flex flex-col bg-white dark:bg-main-bg-solid-dark rounded-l-2xl"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-between items-center">
            <p className="text-4xl dark:text-mint-300">
              {match ? match.musicSubmission.songName : "..."}
            </p>
            <div className="flex flex-row items-center gap-1 ">
              <p className="text-xs text-cream-600 dark:text-gray-200">
                Artist/Band
              </p>
              {match ? (
                <User name={match.musicSubmission.performerName} />
              ) : (
                <p className="text-cream-600 italic dark:text-gray-200">
                  {"..."}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Description */}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <MusicNote />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Genres
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? formatAllCapsList(match.musicSubmission.genres)
                  : "..."}
              </p>
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Calendar />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Date submitted
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? match.musicSubmission.createdAt.toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : "..."}
              </p>
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Link className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Song link
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match ? (
                  <a
                    href={match.musicSubmission.songLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    View Song
                  </a>
                ) : (
                  <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                    {"..."}
                  </p>
                )}
              </p>
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Group />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Submitter
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? match.musicSubmission.submitter.firstName +
                    " " +
                    match.musicSubmission.submitter.lastName
                  : "..."}
              </p>
            </div>

            {match && match.musicSubmission.additionalInfo.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1 items-center">
                  <FileIcon />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Additional information
                  </p>
                </div>
                <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                  {match.musicSubmission.additionalInfo}
                </p>
              </div>
            )}
          </div>

          <p className="text-xl dark:text-gray-200">Match info</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Check />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Status
                </p>
              </div>
              {match ? (
                <StatusIndicator
                  variant={getMatchStatus(match).variant}
                  text={getMatchStatus(match).text}
                />
              ) : (
                <p className="text-sm text-dark-gray-400">{"..."}</p>
              )}
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Check />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Step
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? match.matchState
                      .split("_")
                      .map((w) => formatAllCapsWord(w))
                      .join(" ")
                  : "..."}
              </p>
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Calendar />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Date matched
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? match.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "..."}
              </p>
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Calendar />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Date last updated
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {match
                  ? match.updatedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "..."}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
