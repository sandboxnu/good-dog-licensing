"use client";

import { Link } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";

import { formatAllCapsWord } from "../../../utils/allCapsListFormatter";
import StatusIndicator from "../../base/StatusIndicator";
import Calendar from "../../svg/Calendar";
import Camera from "../../svg/Camera";
import Check from "../../svg/Check";
import Deadline from "../../svg/Deadline";
import FileIcon from "../../svg/FileIcon";
import MusicNote from "../../svg/GreyMusicNote";
import Group from "../../svg/Group";
import User from "./User";

type MatchType = GetProcedureOutput<"getSongRequestById">["matches"][number];

const ordinal = (day: number) => {
  const endings = ["th", "st", "nd", "rd"];
  const offset = day % 100;
  const suffix = endings[(offset - 20) % 10] ?? endings[offset] ?? "th";
  return `${day}${suffix}`;
};

export default function MatchDrawer({
  match,
  open,
  onClose,
}: {
  match: MatchType;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[600px] flex-col rounded-l-2xl border border-cream-400 bg-white px-9 py-12 dark:border-dark-gray-400 dark:bg-dark-gray-600"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-between items-center">
            <p className="text-[40px] text-dark-gray-500 dark:text-gray-300 font-semibold leading-[1.28]">
              {match.musicSubmission.songName}
            </p>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Match Information */}
          <div className="space-y-4">
            <p className="text-xl font-semibold leading-[1.28] text-dark-gray-500 dark:text-gray-300">
              Match Information
            </p>
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-6">
              <div className="contents">
                <div className="flex flex-row items-center gap-1">
                  <Calendar />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Date updated
                  </p>
                </div>
                <p className="text-base text-dark-gray-400 dark:text-cream-400">
                  {match.updatedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="contents">
                <div className="flex flex-row items-center gap-1">
                  <Deadline />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Date matched
                  </p>
                </div>
                <p className="text-base text-dark-gray-400 dark:text-cream-400">
                  {match.createdAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="contents">
                <div className="flex flex-row items-center gap-1">
                  <Check />
                  <p className="text-base text-cream-600 dark:text-gray-200">
                    Status
                  </p>
                </div>
                <StatusIndicator
                  status={match.admModStatus}
                  details={match.matchState}
                />
              </div>
            </div>
          </div>
          {/* border is arbitrarily add in the div below */}
          {/* Song Information */}
          <div className="border-t-[0.5px] border-cream-400 pt-6 dark:border-dark-gray-400">
            <p className="mb-4 text-xl font-semibold leading-[1.28] text-dark-gray-500 dark:text-gray-300">
              Song Information
            </p>
            <div className="pr-[40px]">
              {/* Song Information Grid Information */}
              <div className="inline-grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-6">
                <div className="contents">
                  <div className="flex flex-row items-center gap-1">
                    <Camera />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Musician
                    </p>
                  </div>
                  <User
                    name={
                      match.musicSubmission.submitter.firstName +
                      " " +
                      match.musicSubmission.submitter.lastName
                    }
                    id={match.musicSubmission.submitterId}
                  />
                </div>
                <div className="contents">
                  <div className="flex flex-row items-center gap-1">
                    <Group />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Songwriters
                    </p>
                  </div>
                  <p className="text-base text-dark-gray-400 dark:text-cream-400">
                    {[
                      match.musicSubmission.submitter,
                      ...match.musicSubmission.contributors,
                    ]
                      .map(
                        (contributor) =>
                          `${contributor.firstName} ${contributor.lastName}`,
                      )
                      .join(", ")}
                  </p>
                </div>
                <div className="contents">
                  <div className="flex flex-row items-center gap-1">
                    <Deadline />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Date Submitted
                    </p>
                  </div>

                  <p className="text-base text-dark-gray-400 dark:text-cream-400">
                    {match.musicSubmission.createdAt.toLocaleDateString(
                      "en-US",
                      { month: "long" },
                    )}{" "}
                    {ordinal(match.musicSubmission.createdAt.getDate())}
                  </p>
                </div>
                <div className="contents">
                  <div className="flex flex-row items-center gap-1">
                    <Link className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Song link
                    </p>
                  </div>
                  <p className="text-base text-green-500 dark:text-mint-200">
                    <a
                      href={match.musicSubmission.songLink}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4"
                    >
                      {match.musicSubmission.songLink}
                    </a>
                  </p>
                </div>
              </div>
              {/* Song Information Long Information */}
              <div className="mt-6 space-y-6">
                <div className="col-span-2 flex flex-col">
                  <div className="flex flex-row items-center gap-1">
                    <MusicNote />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Genre(s)
                    </p>
                  </div>
                  <div className="text-sm text-dark-gray-400 dark:text-gray-200">
                    <div className="col-span-2 flex flex-row flex-wrap gap-1">
                      {match.musicSubmission.genres.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full border border-gray-400 dark:border-dark-gray-200 px-2 py-0.5 text-base text-gray-500 dark:text-gray-300 bg-gray-300 dark:bg-gray-500"
                        >
                          {formatAllCapsWord(genre)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {match.musicSubmission.additionalInfo.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-1">
                      <FileIcon />
                      <p className="text-sm text-gray-500 dark:text-gray-200">
                        Additional information
                      </p>
                    </div>
                    <p className="text-base text-dark-gray-300 dark:text-cream-400">
                      {match.musicSubmission.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
