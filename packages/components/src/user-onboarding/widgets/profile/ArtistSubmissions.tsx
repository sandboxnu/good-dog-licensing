"use client";

import { LinkIcon } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";

import { formatAllCapsWord } from "../../../../utils/allCapsListFormatter";
import FileIcon from "../../../svg/FileIcon";
import Group from "../../../svg/Group";
import ProfileSection from "./ProfileSection";
import SubmissionCard, { TruncatedText } from "./SubmissionCard";

type UserByIdOutput = GetProcedureOutput<"userById">;

function MusicSubmissionContent({
  song,
}: {
  song: UserByIdOutput["musicSubmissions"][number];
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <LinkIcon className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Song Link
            </p>
          </div>
          <a
            href={song.songLink}
            target="_blank"
            rel="noreferrer"
            className="text-base text-green-500 underline underline-offset-4 dark:text-mint-200"
          >
            {song.songLink}
          </a>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Genre icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">Genre</p>
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            {song.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border-[0.5px] border-gray-400 bg-gray-300 px-2 py-0.5 text-sm text-gray-500 dark:border-dark-gray-200 dark:bg-gray-500 dark:text-gray-300"
              >
                {formatAllCapsWord(genre)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1">
          <Group />
          <p className="text-sm text-cream-600 dark:text-gray-200">
            Songwriters
          </p>
        </div>
        <p className="text-base text-dark-gray-400 dark:text-cream-400">
          {song.contributors
            .map((c) => c.firstName + " " + c.lastName)
            .join(", ")}
        </p>
      </div>

      {song.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Additional info icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Additional Information
            </p>
          </div>
          <TruncatedText text={song.additionalInfo} />
        </div>
      )}
    </>
  );
}

function ProjectSubmissionContent({
  project,
}: {
  project: UserByIdOutput["projectSubmissionsAsOwner"][number];
}) {
  const songRequestCount = project.songRequests?.length ?? 0;
  const activeSongRequests = songRequestCount;

  return (
    <>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Media icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">Media</p>
          </div>
          <p className="text-base text-dark-gray-400 dark:text-cream-400">
            {project.projectType}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Deadline icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Deadline
            </p>
          </div>
          <p className="text-base text-dark-gray-400 dark:text-cream-400">
            {project.deadline
              ? new Date(project.deadline).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })
              : "--"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Active requests icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Active song requests
            </p>
          </div>
          <p className="text-base text-dark-gray-400 dark:text-cream-400">
            {activeSongRequests}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Total requests icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Total song requests
            </p>
          </div>
          <p className="text-base text-dark-gray-400 dark:text-cream-400">
            {songRequestCount}
          </p>
        </div>
      </div>

      {project.description && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            <FileIcon />
            <p className="text-sm text-cream-600 dark:text-gray-200">Summary</p>
          </div>
          <TruncatedText text={project.description} />
        </div>
      )}

      {project.additionalInfo && project.additionalInfo.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-1">
            {/* Additional info icon */}
            <p className="text-sm text-cream-600 dark:text-gray-200">
              Additional Information
            </p>
          </div>
          <TruncatedText text={project.additionalInfo} />
        </div>
      )}
    </>
  );
}

export default function ArtistSubmissions({ user }: { user: UserByIdOutput }) {
  if (user.role === "MUSICIAN") {
    return (
      <ProfileSection header="Song submissions">
        <div className="flex flex-col gap-4 p-6">
          {user.musicSubmissions.map((song) => (
            <SubmissionCard
              key={song.musicId}
              title={song.songName}
              tags={song.genres.map(formatAllCapsWord)}
            >
              <MusicSubmissionContent song={song} />
            </SubmissionCard>
          ))}
        </div>
      </ProfileSection>
    );
  }

  const allProjects = [
    ...user.projectSubmissionsAsOwner,
    ...user.projectSubmissionsAsManager,
  ];

  return (
    <ProfileSection header="Project submissions">
      <div className="flex flex-col gap-4 p-6">
        {allProjects.map((project) => (
          <SubmissionCard key={project.projectId} title={project.projectTitle}>
            <ProjectSubmissionContent project={project} />
          </SubmissionCard>
        ))}
      </div>
    </ProfileSection>
  );
}
