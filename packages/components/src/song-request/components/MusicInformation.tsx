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
    <div className="flex flex-col gap-4 p-6 rounded-2xl border-[0.5px] border-light-gray shadow-md">
      <p className="text-xl text-gray">Music Information</p>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Music Title</p>
        <p>{musicSubmission ? musicSubmission.songName : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Artist/Band</p>
        <p>{musicSubmission ? musicSubmission.performerName : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Genre(s)</p>
        <p>
          {musicSubmission ? formatAllCapsList(musicSubmission.genres) : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Date Submitted</p>
        <p>
          {musicSubmission?.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Link</p>

        {musicSubmission ? (
          <div className="flex flex-row gap-1 text-secondary font-extrabold items-center">
            <Link size={16} />
            <a
              href={musicSubmission.songLink}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              View Song
            </a>
          </div>
        ) : (
          <p>{"..."}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Submitter</p>
        <p>
          {submitter ? submitter.firstName + " " + submitter.lastName : "..."}
        </p>
      </div>
      {musicSubmission && musicSubmission.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-gray">Additional Information</p>
          <p>{musicSubmission.additionalInfo}</p>
        </div>
      )}
    </div>
  );
}
