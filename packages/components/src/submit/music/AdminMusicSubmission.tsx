"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";

import { search } from "../../../utils/search";
import Button from "../../base/Button";
import SearchBar from "../../base/SearchBar";
import MusicSubmissionWidget from "./MusicSubmissionWidget";

interface Musician {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Admin flow for posting a song on a musician's behalf: pick the musician,
 * then fill out the regular song submission form as them.
 */
export default function AdminMusicSubmission() {
  const [selectedMusician, setSelectedMusician] = useState<Musician | null>(
    null,
  );

  if (selectedMusician) {
    return (
      <div className="flex w-full max-w-[752px] flex-col items-center gap-4">
        <div className="flex w-full justify-start">
          <Button
            type="button"
            label="Choose a different musician"
            size="medium"
            variant="text"
            onClick={() => setSelectedMusician(null)}
          />
        </div>
        <MusicSubmissionWidget
          // Remount when the musician changes so the form starts fresh
          key={selectedMusician.userId}
          mode={{ type: "admin", musician: selectedMusician }}
        />
      </div>
    );
  }

  return <MusicianPicker onSelect={setSelectedMusician} />;
}

function MusicianPicker({
  onSelect,
}: {
  onSelect: (musician: Musician) => void;
}) {
  const [musicians] = trpc.musicians.useSuspenseQuery();
  const [query, setQuery] = useState("");

  const filtered = musicians.filter(
    (m) =>
      search(`${m.firstName} ${m.lastName}`, query) || search(m.email, query),
  );

  return (
    <div className="flex w-full max-w-[752px] flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 px-6 py-6 md:px-10 dark:bg-dark-gray-600">
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-medium text-green-500 md:text-5xl dark:text-mint-200">
          Add song for musician
        </p>
        <p className="text-base font-medium text-dark-gray-500 md:text-lg dark:text-gray-200">
          Choose the musician you are submitting this song for. They must
          already have a Good Dog account. Once submitted, the musician will be
          asked to review and approve the song before it can be matched.
        </p>
      </div>
      <SearchBar
        onChange={setQuery}
        placeholder="Search musicians by name or email"
      />
      <div className="flex max-h-[420px] flex-col overflow-y-auto rounded-lg border-[0.5px] border-dark-gray-100 bg-white dark:border-dark-gray-300 dark:bg-dark-gray-500">
        {filtered.map((musician) => (
          <button
            key={musician.userId}
            type="button"
            onClick={() => onSelect(musician)}
            className="flex flex-col items-start gap-1 border-b-[0.5px] border-dark-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-mint-200 dark:border-dark-gray-300 dark:hover:bg-green-400"
          >
            <span className="text-body1 font-semibold text-dark-gray-500 dark:text-mint-300">
              {musician.firstName} {musician.lastName}
            </span>
            <span className="text-body3 text-dark-gray-300 dark:text-gray-200">
              {musician.email}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-3 text-body3 text-dark-gray-300 dark:text-gray-200">
            No musicians found.
          </p>
        )}
      </div>
    </div>
  );
}
