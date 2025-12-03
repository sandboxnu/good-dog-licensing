import type { SongRequest } from ".prisma/client";

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequest | undefined;
}) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border-[0.5px] border-light-gray shadow-md">
      <p className="text-xl text-gray">Song Request Information</p>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Song Request Title</p>
        <p>{songRequest ? songRequest.songRequestTitle : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Request Added</p>
        <p>
          {songRequest
            ? monthNames[songRequest.createdAt.getMonth()] +
              " " +
              songRequest.createdAt.getDate().toString() +
              ", " +
              songRequest.createdAt.getFullYear().toString()
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Summary</p>
        <p>{songRequest ? songRequest.description : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Purpose</p>
        <p>{songRequest ? songRequest.feelingsConveyed : "..."}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray">Additional Information</p>
        <p>{songRequest ? songRequest.additionalInfo : "..."}</p>
      </div>
    </div>
  );
}
