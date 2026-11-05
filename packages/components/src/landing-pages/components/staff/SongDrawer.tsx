"use client";

import {
  CalendarCheck,
  File,
  LinkIcon,
  Music,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@good-dog/ui/sheet";

import {
  getGenreLabel,
  getMusicAffiliationLabel,
  getMusicRoleLabel,
} from "../../../../utils/enumLabelMapper";
import User from "../../../matching/components/User";
import SongLyrics from "../../../music/components/SongLyrics";

type MusicSubmission = GetProcedureOutput<"allMusic">[number];
type Contributor = MusicSubmission["contributors"][number];

export default function SongDrawer({
  song,
  open,
  onClose,
}: {
  song: MusicSubmission;
  open: boolean;
  onClose: () => void;
}) {
  // Genres can be stored more than once on a submission; show each one once.
  const genres = [...new Set(song.genres)];

  // Show the submitter first, then everyone else alphabetically.
  const contributors = [...song.contributors].sort((a, b) =>
    a.isSubmitter !== b.isSubmitter
      ? a.isSubmitter
        ? -1
        : 1
      : (a.firstName + " " + a.lastName)
          .toLocaleLowerCase()
          .localeCompare((b.firstName + " " + b.lastName).toLocaleLowerCase()),
  );

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="flex w-[50vw] min-w-[600px] flex-col rounded-l-2xl bg-white px-9 py-12 max-md:w-full max-md:min-w-0 max-md:rounded-none max-md:px-5 max-md:py-10 dark:bg-main-bg-solid-dark"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex flex-row items-center justify-between gap-4 max-md:flex-col max-md:items-start max-md:gap-2">
            <p className="text-4xl wrap-break-word max-md:text-2xl dark:text-mint-300">
              {song.songName}
            </p>
            <div className="flex shrink-0 flex-row items-center gap-1">
              <p className="text-xs text-cream-600 dark:text-gray-200">
                Submitted by{" "}
              </p>
              <User
                name={song.submitter.firstName + " " + song.submitter.lastName}
                id={song.submitterId}
                role={"MUSICIAN"}
              />
            </div>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <DetailRow icon={<UsersRound />} label="Artist/Band">
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {song.performerName}
              </p>
            </DetailRow>

            <DetailRow icon={<CalendarCheck />} label="Date submitted">
              <p className="text-sm text-dark-gray-400 dark:text-gray-200">
                {song.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </DetailRow>

            <DetailRow icon={<Music />} label="Genre(s)">
              <div className="flex flex-row flex-wrap gap-1">
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <p
                      key={genre}
                      className="rounded-2xl border-[0.5px] border-gray-400 bg-gray-300 px-2 py-1 text-sm text-gray-500 dark:border-dark-gray-200 dark:bg-gray-500 dark:text-gray-300"
                    >
                      {getGenreLabel(genre)}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-cream-600 italic dark:text-gray-200">
                    None listed
                  </p>
                )}
              </div>
            </DetailRow>

            <DetailRow icon={<LinkIcon />} label="Song link">
              <a
                href={song.songLink}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 truncate text-sm text-green-500 underline underline-offset-4 dark:text-mint-200"
              >
                {song.songLink}
              </a>
            </DetailRow>

            {song.additionalInfo.length > 0 && (
              <div className="flex flex-col gap-1">
                <DetailLabel icon={<File />} label="Additional information" />
                <p className="text-sm wrap-break-word text-dark-gray-400 dark:text-gray-200">
                  {song.additionalInfo}
                </p>
              </div>
            )}

            <SongLyrics lyrics={song.songLyrics} />
          </div>

          <p className="text-xl dark:text-gray-200">Contributors</p>
          <div className="flex flex-col gap-4">
            {contributors.length > 0 ? (
              contributors.map((contributor) => (
                <ContributorCard
                  contributor={contributor}
                  key={contributor.contributorId}
                />
              ))
            ) : (
              <p className="text-sm text-cream-600 italic dark:text-gray-200">
                No contributors listed
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailLabel({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex shrink-0 flex-row items-center gap-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400">
      {icon}
      <p className="text-sm text-cream-600 dark:text-gray-200">{label}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-row items-center gap-6 max-sm:gap-4">
      <DetailLabel icon={icon} label={label} />
      {children}
    </div>
  );
}

function ContributorCard({ contributor }: { contributor: Contributor }) {
  const affiliation =
    contributor.affiliation === "OTHER" && contributor.otherAffiliationName
      ? contributor.otherAffiliationName
      : contributor.affiliation
        ? getMusicAffiliationLabel(contributor.affiliation)
        : null;

  const fields: { label: string; value: string | null }[] = [
    {
      label: "Role(s)",
      value:
        contributor.roles.length > 0
          ? contributor.roles.map(getMusicRoleLabel).join(", ")
          : null,
    },
    { label: "Email", value: contributor.email },
    { label: "Affiliation", value: affiliation },
    { label: "IPI", value: contributor.ipi },
    { label: "Publisher", value: contributor.publisher },
    { label: "Publisher IPI", value: contributor.publisherIpi },
  ];

  return (
    <div className="dark:border-cream-700 flex flex-col gap-3 rounded-2xl border-[0.5px] border-cream-500 px-4 py-4 sm:px-6">
      <div className="flex flex-row flex-wrap items-center gap-2">
        <UserRound className="h-4 w-4 text-gray-400" />
        <p className="text-dark-gray-500 dark:text-gray-200">
          {contributor.firstName + " " + contributor.lastName}
        </p>
        {contributor.isSubmitter && (
          <p className="rounded-sm bg-mint-300 px-2 py-0.5 text-xs text-green-500 dark:bg-green-400 dark:text-mint-300">
            Submitter
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex min-w-0 flex-col">
            <p className="text-xs text-cream-600 dark:text-gray-200">{label}</p>
            <p className="truncate text-sm text-dark-gray-400 dark:text-gray-200">
              {value ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
