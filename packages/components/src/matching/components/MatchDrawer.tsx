"use client";

import { Link } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";

import {
  formatAllCapsList,
  formatAllCapsWord,
} from "../../../utils/allCapsListFormatter";
import StatusIndicator from "../../base/StatusIndicator";
import Calendar from "../../svg/Calendar";
import Check from "../../svg/Check";
import FileIcon from "../../svg/FileIcon";
import MusicNote from "../../svg/GreyMusicNote";
import Group from "../../svg/Group";
import User from "./User";

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
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[30vw] flex-col rounded-l-2xl bg-white px-9 py-12 dark:bg-main-bg-solid-dark"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center justify-between">
            <p className="text-4xl dark:text-mint-300">
              {match ? match.musicSubmission.songName : "..."}
            </p>
            <div className="flex flex-row items-center gap-1">
              <p className="text-xs text-cream-600 dark:text-gray-200">
                Artist/Band
              </p>
              {match ? (
                <User name={match.musicSubmission.performerName} />
              ) : (
                <p className="italic text-cream-600 dark:text-gray-200">
                  {"..."}
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Description */}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row items-center gap-1">
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
              <div className="flex flex-row items-center gap-1">
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
              <div className="flex flex-row items-center gap-1">
                <Link className="h-4 w-4 text-gray-400" />
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
              <div className="flex flex-row items-center gap-1 text-gray-400">
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
                <div className="flex flex-row items-center gap-1">
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
              <div className="flex flex-row items-center gap-1">
                <Check />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Status
                </p>
              </div>
              {match ? (
                <StatusIndicator status={match.admModStatus} />
              ) : (
                <p className="text-sm text-dark-gray-400">{"..."}</p>
              )}
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row items-center gap-1">
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
              <div className="flex flex-row items-center gap-1">
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
              <div className="flex flex-row items-center gap-1">
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
