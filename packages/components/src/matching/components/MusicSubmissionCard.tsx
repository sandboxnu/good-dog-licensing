import { ChevronRight, LinkIcon } from "lucide-react";
import { useState } from "react";
import Button from "../../base/Button";
import Group from "../../svg/Group";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import FileIcon from "../../svg/FileIcon";
import GreyMusicNote from "../../svg/GreyMusicNote";
import { formatAllCapsWord } from "../../../utils/allCapsListFormatter";

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
    <div className="flex flex-col gap-2 border-[0.5px] border-cream-500 dark:border-cream-700 rounded-2xl">
      <div
        className={`flex flex-row justify-between px-6 ${open ? "pt-4" : "py-4"}`}
      >
        <div className="flex flex-row gap-4 items-center">
          <ChevronRight
            className={`w-6 h-6 text-dark-gray-500 dark:text-gray-300 hover:cursor-pointer transition-all ${open && "rotate-90"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex flex-col gap-1">
            <a
              target="_blank"
              className="flex flex-row gap-1 text-green-500 dark:text-mint-200 underline"
              href={musicSubmission.songLink}
            >
              <p className="text-green-500 dark:text-mint-200">
                {musicSubmission.songName}
              </p>
              <LinkIcon className="w-4 h-4" />
            </a>
            {!open && (
              <p className="text-dark-gray-300 dark:text-dark-gray-200">
                {musicSubmission.performerName}
              </p>
            )}
          </div>
          {!open && (
            <div className="flex flex-row gap-1 items-center">
              {musicSubmission.genres.slice(0, 3).map((genre, index) => (
                <p
                  key={`${musicSubmission.musicId}-${genre}-${index}`}
                  className="bg-gray-300 dark:bg-gray-500 text-gray-500 dark:text-gray-300 border-[0.5px] border-gray-400 dark:border-dark-gray-200 rounded-2xl p-1.5 max-w-[100px] truncate"
                  title={genre}
                >
                  {genre
                    .split("_")
                    .map((w) => formatAllCapsWord(w))
                    .join(" ")}
                </p>
              ))}
              {musicSubmission.genres.length > 3 && (
                <p className="bg-gray-300 rounded-2xl p-1.5">
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
          <div className="flex flex-row items-center ">
            <div className="flex flex-col gap-2 w-1/2 ">
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
              <div className="flex flex-row gap-1 items-center">
                {musicSubmission.genres.slice(0, 3).map((genre, index) => (
                  <p
                    key={`${musicSubmission.musicId}-${genre}-${index}`}
                    className="bg-gray-300 dark:bg-gray-500 text-gray-500 dark:text-gray-300 border-[0.5px] border-gray-400 dark:border-dark-gray-200 rounded-2xl p-1.5 max-w-[100px] truncate"
                    title={genre}
                  >
                    {genre
                      .split("_")
                      .map((w) => formatAllCapsWord(w))
                      .join(" ")}
                  </p>
                ))}
                {musicSubmission.genres.length > 3 && (
                  <p className="bg-gray-300 rounded-2xl px-2">
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
