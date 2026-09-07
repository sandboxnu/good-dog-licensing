import { useState } from "react";
import { X } from "lucide-react";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { Genre } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@good-dog/ui/dialog";

import { getGenreLabel } from "../../../utils/enumLabelMapper";
import MultiselectDropdownFilter from "../../base/MultiSelectDropdownFilter";
import { MusicSearchBar } from "./MusicSearchBar";
import { MusicSubmissionCard } from "./MusicSubmissionCard";

type MusicSubmissionType = GetProcedureOutput<"allMusic">[number];
type MatchesRequestType = GetProcedureOutput<"getSongRequestById">["matches"];

interface MusicSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (music: MusicSubmissionType[]) => void;
  matches: MatchesRequestType;
}

export function MusicSearchModal({
  open,
  onOpenChange,
  onAction,
  matches,
}: MusicSearchModalProps) {
  const [allMusic] = trpc.allMusic.useSuspenseQuery();

  const [searchedMusic, setSearchedMusic] =
    useState<MusicSubmissionType[]>(allMusic);
  const [suggestedMusic, setSuggestedMusic] = useState<MusicSubmissionType[]>(
    [],
  );

  const handleCancel = () => {
    setSuggestedMusic([]);
  };

  const handleDone = () => {
    onAction(suggestedMusic);
    setSuggestedMusic([]);
    onOpenChange(false);
  };

  const artistOptions = [
    ...new Set(allMusic.map((song) => song.performerName)),
  ].map((name) => ({ label: name, value: name }));

  const genreOptions = Object.values(Genre).map((genre) => ({
    label: getGenreLabel(genre),
    value: genre,
  }));

  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const filteredMusic = searchedMusic.filter((music) => {
    if (
      selectedArtists.length > 0 &&
      !selectedArtists.includes(music.performerName)
    ) {
      return false;
    }
    if (
      selectedGenres.length > 0 &&
      !music.genres.some((g) => selectedGenres.includes(g))
    ) {
      return false;
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="dark:border-cream-700 flex min-h-[432px] min-w-[800px] flex-col rounded-2xl border border-cream-500 bg-white p-6 dark:bg-dark-gray-600"
        hideCloseButton
      >
        <DialogTitle></DialogTitle>
        <div className="flex w-full flex-1 flex-col gap-4">
          <MusicSearchBar
            setSearchedMusic={setSearchedMusic}
            placeholder="Type to find a song or artist"
          />
          {/* Filters */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <MultiselectDropdownFilter
                label="Artists"
                value={selectedArtists}
                onChange={setSelectedArtists}
                options={artistOptions}
                columns={1}
                searchBar
              />
              <MultiselectDropdownFilter
                label="Genre"
                value={selectedGenres}
                onChange={setSelectedGenres}
                options={genreOptions}
                columns={1}
                searchBar
              />
            </div>
            {selectedArtists.length + selectedGenres.length > 0 && (
              <div className="flex flex-row flex-wrap gap-2">
                {selectedArtists.map((artist) => (
                  <Button
                    key={artist}
                    variant="outlined"
                    size="flex-text-with-icon"
                    className="border border-[0.5px] border-green-400 bg-mint-300 hover:bg-mint-300 dark:border-mint-300 dark:bg-green-400 dark:hover:bg-green-400"
                    onClick={() =>
                      setSelectedArtists(
                        selectedArtists.filter((a) => a !== artist),
                      )
                    }
                  >
                    <div className="flex items-center gap-1 text-green-400 dark:text-mint-300">
                      <X className="h-4 w-4" />
                      {artist}
                    </div>
                  </Button>
                ))}
                {selectedGenres.map((genre) => (
                  <Button
                    key={genre}
                    variant="outlined"
                    size="flex-text-with-icon"
                    className="border border-[0.5px] border-green-400 bg-mint-300 hover:bg-mint-300 dark:border-mint-300 dark:bg-green-400 dark:hover:bg-green-400"
                    onClick={() =>
                      setSelectedGenres(
                        selectedGenres.filter((g) => g !== genre),
                      )
                    }
                  >
                    <div className="flex items-center gap-1 text-green-400 dark:text-mint-300">
                      <X className="h-4 w-4" />
                      {getGenreLabel(genre as Genre)}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
          <div className="max-h-80 flex-1 overflow-y-auto">
            <p className="mb-4 text-base text-gray-500 dark:text-gray-200">
              Results
            </p>
            {filteredMusic.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filteredMusic.map((musicSubmission) => (
                  <MusicSubmissionCard
                    key={musicSubmission.musicId}
                    musicSubmission={musicSubmission}
                    isMatched={matches.some((match) => {
                      return (
                        match.musicSubmission.musicId ===
                        musicSubmission.musicId
                      );
                    })}
                    isSuggested={suggestedMusic.includes(musicSubmission)}
                    onSuggest={() =>
                      setSuggestedMusic([...suggestedMusic, musicSubmission])
                    }
                    onUnSuggest={() =>
                      setSuggestedMusic((prev) =>
                        prev.filter(
                          (m) => m.musicId !== musicSubmission.musicId,
                        ),
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-p-32 text-center text-base text-gray-500 dark:text-gray-200">
                Search for a song above!
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outlined" className="px-6" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>

          <Button className="px-6" onClick={handleDone} variant="contained">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
