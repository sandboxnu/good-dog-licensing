import type { GetProcedureOutput } from "@good-dog/trpc/types";
import StatusIndicator from "../../base/StatusIndicator";
import { getSongRequestStatus } from "../../../utils/getStatusHelper";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-4xl">Song Request Information</p>
      <div className="flex flex-row gap-6 bg-cream-100 justify-start rounded-2xl p-6 border-[0.5px] border-light-gray shadow-md w-full">
        <div className="flex flex-row flex-grow gap-6">
          <div className="flex flex-col gap-4 justify-start flex-grow">
            <div className="flex flex-col gap-1">
              <p className="text-gray">Song Request</p>
              <p>{songRequest.songRequestTitle}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray">Status</p>
              <StatusIndicator {...getSongRequestStatus(songRequest)} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray">Request Added</p>
              <p>
                {songRequest.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[1px] bg-light-gray" />
        <div className="flex flex-col gap-4 justify-start flex-grow">
          <div className="flex flex-col gap-1">
            <p className="text-gray">Summary</p>
            <p>{songRequest.description}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray">Song purpose</p>
            <p>{songRequest.feelingsConveyed}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray">Similar songs</p>
            <p>{songRequest.similarSongs}</p>
          </div>
        </div>
        {songRequest.additionalInfo.length > 0 && (
          <>
            <div className="w-[1px] bg-light-gray" />
            <div className="flex flex-col gap-1 flex-grow">
              <p className="text-gray">Additional Information</p>
              <p>{songRequest.additionalInfo}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
