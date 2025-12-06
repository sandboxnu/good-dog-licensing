import { GetProcedureOutput } from "@good-dog/trpc/types";
import StatusIndicator from "../../base/StatusIndicator";

type SongRequestType = GetProcedureOutput<"getSongRequestById">;

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequestType;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border-[0.5px] border-light-gray shadow-md bg-white w-[560px]">
      <div className="flex flex-col gap-1">
        <p className="text-gray">Status</p>
        <StatusIndicator variant="error" text="Action needed" />
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
      <div className="flex flex-col gap-1">
        <p className="text-gray">Additional information</p>
        <p>{songRequest.additionalInfo}</p>
      </div>
    </div>
  );
}
