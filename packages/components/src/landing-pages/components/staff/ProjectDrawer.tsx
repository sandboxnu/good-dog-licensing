"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";
import User from "../../../matching/components/User";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import Camera from "../../../svg/Camera";
import Deadline from "../../../svg/Deadline";
import FileIcon from "../../../svg/FileIcon";
import SongRequest from "./SongRequest";

type ProjectSubmissionType =
  GetProcedureOutput<"allProjects">["projects"][number];

export default function ProjectDrawer({
  projectSubmission,
  open,
  onClose,
}: {
  projectSubmission: ProjectSubmissionType | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-[50vw] px-9 py-12 flex flex-col bg-white dark:bg-main-bg-solid-dark rounded-l-2xl"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-between items-center">
            <p className="text-4xl dark:text-mint-300">
              {projectSubmission ? projectSubmission.projectTitle : "..."}
            </p>
            <div className="flex flex-row items-center gap-1">
              <p className="text-xs text-cream-600 dark:text-gray-200">Assigned to </p>
              {projectSubmission && projectSubmission.projectManager ? (
                <User
                  name={
                    projectSubmission.projectManager.firstName +
                    " " +
                    projectSubmission.projectManager.lastName
                  }
                />
              ) : (
                <p className="text-cream-600 dark:text-gray-200 italic">No Assignment Yet</p>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Description */}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Camera />
                <p className="text-sm text-cream-600 dark:text-gray-200">Media Maker</p>
              </div>
              <User
                name={
                  projectSubmission
                    ? projectSubmission.projectOwner.firstName +
                      " " +
                      projectSubmission.projectOwner.lastName
                    : "..."
                }
              />
            </div>

            <div className="flex flex-row gap-6">
              <div className="flex flex-row gap-1 items-center">
                <Deadline />
                <p className="text-sm text-cream-600 dark:text-gray-200">Deadline</p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {projectSubmission
                  ? projectSubmission.deadline.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "..."}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-1 items-center">
                <FileIcon />
                <p className="text-sm text-cream-600 dark:text-gray-200">Project information</p>
              </div>
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {projectSubmission ? projectSubmission.description : "..."}
              </p>
            </div>

            {projectSubmission &&
              projectSubmission.additionalInfo.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-1 items-center">
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
            {projectSubmission?.songRequests.map((songRequest) => (
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
