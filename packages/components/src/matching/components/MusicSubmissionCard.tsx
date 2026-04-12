import { useState } from "react";
import { ChevronRight, LinkIcon } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import { formatAllCapsWord } from "../../../utils/allCapsListFormatter";
import Button from "../../base/Button";
import FileIcon from "../../svg/FileIcon";
import GreyMusicNote from "../../svg/GreyMusicNote";
import Group from "../../svg/Group";

type MusicSubmissionType = GetProcedureOutput<"allMusic">[number];

export function MusicSubmissionCard({
  musicSubmission,
  isMatched,
  isSuggested,
  onSuggest,
  onUnSuggest,
}: {
  musicSubmission: MusicSubmissionType;
  isMatched: boolean;
  isSuggested: boolean;
  onSuggest: (music: MusicSubmissionType) => void;
  onUnSuggest: (music: MusicSubmissionType) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="dark:border-cream-700 flex flex-col gap-2 rounded-2xl border-[0.5px] border-cream-500">
      <div
        className={`flex flex-row justify-between px-6 ${open ? "pt-4" : "py-4"}`}
      >
        <div className="flex flex-row items-center gap-4">
          <ChevronRight
            className={`h-6 w-6 text-dark-gray-500 transition-all hover:cursor-pointer dark:text-gray-300 ${open && "rotate-90"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex flex-col gap-1">
            <a
              target="_blank"
              className="flex flex-row gap-1 text-green-500 underline dark:text-mint-200"
              href={musicSubmission.songLink}
            >
              <p className="text-green-500 dark:text-mint-200">
                {musicSubmission.songName}
              </p>
              <LinkIcon className="h-4 w-4" />
            </a>
            {!open && (
              <p className="text-dark-gray-300 dark:text-dark-gray-200">
                {musicSubmission.performerName}
              </p>
            )}
          </div>
          {!open && (
            <div className="flex flex-row items-center gap-1">
              {musicSubmission.genres.slice(0, 3).map((genre, index) => (
                <p
                  key={`${musicSubmission.musicId}-${genre}-${index}`}
                  className="max-w-[100px] truncate rounded-2xl border-[0.5px] border-gray-400 bg-gray-300 p-1.5 text-gray-500 dark:border-dark-gray-200 dark:bg-gray-500 dark:text-gray-300"
                  title={genre}
                >
                  {genre
                    .split("_")
                    .map((w) => formatAllCapsWord(w))
                    .join(" ")}
                </p>
              ))}
              {musicSubmission.genres.length > 3 && (
                <p className="rounded-2xl bg-gray-300 p-1.5">
                  +{musicSubmission.genres.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>
        {isMatched ? (
          <Button label="Matched" size={"medium"} variant={"contained"} />
        ) : isSuggested ? (
          <Button
            label="Suggested"
            size={"medium"}
            variant={"contained"}
            displayIcon="check"
            onClick={() => onUnSuggest(musicSubmission)}
          />
        ) : (
          <Button
            label={"Suggest"}
            size={"medium"}
            variant={"outlined"}
            displayIcon={"plus"}
            onClick={() => onSuggest(musicSubmission)}
          />
        )}
      </div>
      {open && (
        <div className="flex flex-col gap-5 px-6 pb-6">
          <div className="flex flex-row items-center">
            <div className="flex w-1/2 flex-col gap-2">
              <div className="flex flex-row gap-2">
                <Group />
                <p className="text-dark-gray-300 dark:text-dark-gray-200">
                  Artist
                </p>
              </div>
              <p className="text-dark-gray-300 dark:text-dark-gray-200">
                {musicSubmission.performerName}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <GreyMusicNote />
                <p className="text-dark-gray-300 dark:text-dark-gray-200">
                  Genre
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                {musicSubmission.genres.slice(0, 3).map((genre, index) => (
                  <p
                    key={`${musicSubmission.musicId}-${genre}-${index}`}
                    className="max-w-[100px] truncate rounded-2xl border-[0.5px] border-gray-400 bg-gray-300 p-1.5 text-gray-500 dark:border-dark-gray-200 dark:bg-gray-500 dark:text-gray-300"
                    title={genre}
                  >
                    {genre
                      .split("_")
                      .map((w) => formatAllCapsWord(w))
                      .join(" ")}
                  </p>
                ))}
                {musicSubmission.genres.length > 3 && (
                  <p className="rounded-2xl bg-gray-300 px-2">
                    +{musicSubmission.genres.length - 3} more
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <Group />
              <p className="text-dark-gray-300 dark:text-dark-gray-200">
                Contributors
              </p>
            </div>
            <p className="text-dark-gray-300 dark:text-dark-gray-200">
              {musicSubmission.contributors
                .map(
                  (contributor) =>
                    contributor.firstName + " " + contributor.lastName,
                )
                .join(", ")}
            </p>
          </div>

          {musicSubmission.additionalInfo.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <FileIcon />
                <p className="text-dark-gray-300 dark:text-dark-gray-200">
                  Additional information
                </p>
              </div>
              <p className="text-dark-gray-300 dark:text-dark-gray-200">
                {musicSubmission.additionalInfo}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
