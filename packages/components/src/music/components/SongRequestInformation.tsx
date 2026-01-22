import type { SongRequest } from ".prisma/client";

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequest | undefined;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border-[0.5px] border-light-gray shadow-md">
      <p className="text-xl text-gray-200 dark:text-gray-100">
        Song Request Information
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Song Request Title</p>
        <p className="text-gray-200 dark:text-gray-100">
          {songRequest ? songRequest.songRequestTitle : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Request Added</p>
        <p className="text-gray-200 dark:text-gray-100">
          {songRequest ? songRequest.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }) : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Summary</p>
        <p className="text-gray-200 dark:text-gray-100">
          {songRequest ? songRequest.description : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-200 dark:text-gray-100">Purpose</p>
        <p className="text-gray-200 dark:text-gray-100">
          {songRequest ? songRequest.feelingsConveyed : "..."}
        </p>
      </div>
      {songRequest && songRequest.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-gray-200 dark:text-gray-100">
            Additional Information
          </p>
          <p className="text-gray-200 dark:text-gray-100">
            {songRequest.additionalInfo}
          </p>
        </div>
      )}
    </div>
  );
}
