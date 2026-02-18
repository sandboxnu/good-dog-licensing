import type { MusicSubmission } from ".prisma/client";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";
import { Link } from "lucide-react";

export default function MusicInformation({
  musicSubmission,
  submitter,
}: {
  musicSubmission: MusicSubmission | undefined;
  submitter: { firstName: string; lastName: string } | undefined;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-cream-100 dark:bg-green-600 border-[0.5px] border-light-gray shadow-md max-w-[220px]">
      <p className="text-xl text-dark-gray-200 dark:text-dark-gray-100">
        Music Information
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">
          Music Title
        </p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {musicSubmission ? musicSubmission.songName : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">
          Artist/Band
        </p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {musicSubmission ? musicSubmission.performerName : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">Genre(s)</p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {musicSubmission ? formatAllCapsList(musicSubmission.genres) : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">
          Date Submitted
        </p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {musicSubmission?.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">Link</p>

        {musicSubmission ? (
          <div className="flex flex-row gap-1 text-secondary font-extrabold items-center">
            <Link size={16} />
            <a
              href={musicSubmission.songLink}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 text-green-500 dark:text-mint-200"
            >
              View Song
            </a>
          </div>
        ) : (
          <p className="text-dark-gray-500 dark:text-gray-200">{"..."}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">Submitter</p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {submitter ? submitter.firstName + " " + submitter.lastName : "..."}
        </p>
      </div>
      {musicSubmission && musicSubmission.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-dark-gray-200 dark:text-dark-gray-100">
            Additional Information
          </p>
          <p className="text-dark-gray-200 dark:text-gray-200">
            {musicSubmission.additionalInfo}
          </p>
        </div>
      )}
    </div>
  );
}
