import type { SongRequest } from ".prisma/client";

export default function SongRequestInformation({
  songRequest,
}: {
  songRequest: SongRequest | undefined;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-cream-100 dark:bg-dark-gray-600 border-[0.5px] border-light-gray shadow-md">
      <p className="text-xl text-dark-gray-200 dark:text-dark-gray-100">
        Song Request Information
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">
          Song Request Title
        </p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {songRequest ? songRequest.songRequestTitle : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">
          Request Added
        </p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {songRequest
            ? songRequest.createdAt.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
            : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">Summary</p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {songRequest ? songRequest.description : "..."}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-dark-gray-200 dark:text-dark-gray-100">Purpose</p>
        <p className="text-dark-gray-500 dark:text-gray-200">
          {songRequest ? songRequest.feelingsConveyed : "..."}
        </p>
      </div>
      {songRequest && songRequest.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-dark-gray-200 dark:text-dark-gray-100">
            Additional Information
          </p>
          <p className="text-dark-gray-500 dark:text-gray-200">
            {songRequest.additionalInfo}
          </p>
        </div>
      )}
    </div>
  );
}
