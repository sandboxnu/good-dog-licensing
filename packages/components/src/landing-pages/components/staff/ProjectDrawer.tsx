"use client";

import { trpc } from "@good-dog/trpc/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";

import User from "../../../matching/components/User";
import Camera from "../../../svg/Camera";
import Deadline from "../../../svg/Deadline";
import FileIcon from "../../../svg/FileIcon";
import SongRequest from "./SongRequest";

export default function ProjectDrawer({
  projectSubmissionId,
  open,
  onClose,
}: {
  projectSubmissionId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [projectSubmission] = trpc.getProjectSubmissionById.useSuspenseQuery({
    projectId: projectSubmissionId,
  });

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[50vw] min-w-[600px] flex-col rounded-l-2xl bg-white px-9 py-12 dark:bg-main-bg-solid-dark"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center justify-between">
            <p className="text-4xl dark:text-mint-300">
              {projectSubmission.projectTitle}
            </p>
            <div className="flex flex-row items-center gap-1">
              <p className="text-xs text-cream-600 dark:text-gray-200">
                Assigned to{" "}
              </p>
              {projectSubmission.projectManager ? (
                <User
                  name={
                    projectSubmission.projectManager.firstName +
                    " " +
                    projectSubmission.projectManager.lastName
                  }
                  id={projectSubmission.projectManager.userId}
                />
              ) : (
                <p className="italic text-cream-600 dark:text-gray-200">
                  No Assignment Yet
                </p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Description */}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row items-center gap-1">
                <Camera />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Media Maker
                </p>
              </div>
              <User
                name={
                  projectSubmission.projectOwner.firstName +
                  " " +
                  projectSubmission.projectOwner.lastName
                }
                id={projectSubmission.projectOwnerId}
              />
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row items-center gap-1">
                <Deadline />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Deadline
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {projectSubmission.deadline.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-1">
                <FileIcon />
                <p className="text-sm text-cream-600 dark:text-gray-200">
                  Project information
                </p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {projectSubmission.description}
              </p>
            </div>

            {projectSubmission.additionalInfo.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                  <FileIcon />
                  <p className="text-sm text-cream-600 dark:text-gray-200">
                    Additional information
                  </p>
                </div>
                <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                  {projectSubmission.additionalInfo}
                </p>
              </div>
            )}
          </div>

          <p className="text-xl dark:text-gray-200">Song requests</p>
          <div className="flex flex-col gap-4">
            {projectSubmission.songRequests
              .sort((a, b) =>
                a.songRequestTitle
                  .toLocaleLowerCase()
                  .localeCompare(b.songRequestTitle.toLocaleLowerCase()),
              )
              .map((songRequest) => (
                <SongRequest
                  songRequest={songRequest}
                  key={songRequest.songRequestId}
                />
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
