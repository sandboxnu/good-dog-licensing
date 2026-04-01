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
import Deadline from "../../svg/Deadline";
import Camera from "../../svg/Camera";

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
  match: MatchType | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-[65vw] px-9 py-12 flex flex-col bg-white dark:bg-dark-gray-600 rounded-l-2xl border border-cream-400 dark:border-dark-gray-400"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-between items-center">
            <p className="text-[40px] text-dark-gray-500 dark:text-gray-300 font-semibold leading-[1.28]">
              {match ? match.musicSubmission.songName : "..."}
            </p>
            {/* <div className="flex flex-row items-center gap-1 "> */}
            {/*   <p className="text-xs text-cream-600 dark:text-gray-200"> */}
            {/*     Artist/Band */}
            {/*   </p> */}
            {/*   {match ? ( */}
            {/*     <User name={match.musicSubmission.performerName} /> */}
            {/*   ) : ( */}
            {/*     <p className="text-cream-600 italic dark:text-gray-200"> */}
            {/*       {"..."} */}
            {/*     </p> */}
            {/*   )} */}
            {/* </div> */}
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Match Information */}
          <div className="space-y-4">
            <p className="text-dark-gray-500 dark:text-gray-300 text-xl font-semibold leading-[1.28]">
              Match Information
            </p>
            <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-6 items-center">
              <div className="contents">
                <div className="flex flex-row gap-1 items-center">
                  <Calendar />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Date updated
                  </p>
                </div>
                <p className="text-base text-dark-gray-400 dark:text-cream-400">
                  {match
                    ? match.musicSubmission.createdAt.toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "..."}
                </p>
              </div>
              <div className="contents">
                <div className="flex flex-row gap-1 items-center">
                  <Deadline />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Date matched
                  </p>
                </div>
                <p className="text-base text-dark-gray-400 dark:text-cream-400">
                  {/* TODO: make a matchDate field for match */}
                  {match
                    ? match.updatedAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "--"}
                </p>
              </div>
              <div className="contents">
                <div className="flex flex-row gap-1 items-center">
                  <Check />
                  <p className="text-base text-cream-600 dark:text-gray-200">
                    Status
                  </p>
                </div>
                {match ? (
                  <StatusIndicator status={match.admModStatus} />
                ) : (
                  <p className="text-base text-dark-gray-400 dark:text-cream-400">
                    {"..."}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* border is arbitrarily add in the div below */}
          {/* Song Information */}
          <div className="pt-6 border-t-[0.5px] border-cream-400 dark:border-dark-gray-400">
            <p className="text-dark-gray-500 dark:text-gray-300 text-xl font-semibold leading-[1.28] mb-4">
              Song Information
            </p>
            <div className="pr-[40px]">
              {/* Song Information Grid Information */}
              <div className="inline-grid grid-cols-[auto_1fr] gap-x-5 gap-y-6 items-center">
                <div className="contents">
                  <div className="flex flex-row gap-1 items-center">
                    <Camera />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Musician
                    </p>
                  </div>
                  <User
                    name={
                      match?.musicSubmission.submitter.firstName +
                      " " +
                      match?.musicSubmission.submitter.lastName
                    }
                  />
                </div>
                <div className="contents">
                  <div className="flex flex-row gap-1 items-center">
                    <Group />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Songwriters
                    </p>
                  </div>
                  <p className="text-base text-dark-gray-400 dark:text-cream-400">
                    {match
                      ? [
                          match.musicSubmission.submitter,
                          ...match.musicSubmission.contributors,
                        ]
                          .map(
                            (contributor) =>
                              `${contributor.firstName} ${contributor.lastName}`,
                          )
                          .join(", ")
                      : "--"}
                  </p>
                </div>
                <div className="contents">
                  <div className="flex flex-row gap-1 items-center">
                    <Deadline />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Date Submitted
                    </p>
                  </div>

                  <p className="text-base text-dark-gray-400 dark:text-cream-400">
                    {match
                      ? `${match.musicSubmission.createdAt.toLocaleDateString("en-US", { month: "long" })} ${ordinal(match.musicSubmission.createdAt.getDate())}`
                      : "--"}
                  </p>
                </div>
                <div className="contents">
                  <div className="flex flex-row gap-1 items-center">
                    <Link className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Song link
                    </p>
                  </div>
                  <p className="text-base text-green-500 dark:text-mint-200">
                    {match ? (
                      <a
                        href={match.musicSubmission.songLink}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4"
                      >
                        {match.musicSubmission.songLink}
                      </a>
                    ) : (
                      <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                        {"..."}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              {/* Song Information Long Information */}
              <div className="space-y-6 mt-6">
                <div className="flex flex-col col-span-2">
                  <div className="flex flex-row gap-1 items-center">
                    <MusicNote />
                    <p className="text-sm text-cream-600 dark:text-gray-200">
                      Genre(s)
                    </p>
                  </div>
                  <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                    {match ? (
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
                    ) : (
                      <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                        ...
                      </p>
                    )}
                  </p>
                </div>
                {match && match.musicSubmission.additionalInfo.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-1 items-center">
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
