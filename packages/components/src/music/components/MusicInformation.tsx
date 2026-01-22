import { trpc } from "@good-dog/trpc/client";
import { Link } from "lucide-react";
import { formatAllCapsList } from "../../../utils/allCapsListFormatter";

export default function MusicInformation({
  musicSubmissionId,
}: {
  musicSubmissionId: string;
}) {
  const [musicSubmission] = trpc.getMusicSubmissionById.useSuspenseQuery({
    musicId: musicSubmissionId,
  });

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-4xl">Music Information</p>
      <div className="flex flex-row gap-6 bg-cream-100 justify-start rounded-2xl p-6 border-[0.5px] border-light-gray shadow-md w-full">
        <div className="flex flex-row flex-grow gap-6">
          <div className="flex flex-col gap-4 justify-start flex-grow">
            <div className="flex flex-col gap-1">
              <p className="text-gray">Song</p>
              <p>{musicSubmission.songName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray">Artist/Band</p>
              <p>{musicSubmission.performerName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray">Genre(s)</p>
              {formatAllCapsList(musicSubmission.genres)}
            </div>
          </div>
          <div className="w-[1px] bg-light-gray" />
          <div className="flex flex-col gap-4 justify-start flex-grow">
            <div className="flex flex-col gap-1">
              <p className="text-gray">Date Submitted</p>
              <p>
                {musicSubmission.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray">Link</p>
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
            </div>
          </div>
        </div>
        {musicSubmission.additionalInfo.length > 0 && (
          <>
            <div className="w-[1px] bg-light-gray" />
            <div className="flex flex-col gap-1 flex-grow">
              <p className="text-gray">Additional Information</p>
              <p>{musicSubmission.additionalInfo}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
