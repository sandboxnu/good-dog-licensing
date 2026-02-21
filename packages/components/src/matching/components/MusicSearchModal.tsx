import { Button } from "@good-dog/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@good-dog/ui/dialog";
import { useState } from "react";
import { MusicSubmissionCard } from "./MusicSubmissionCard";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { MusicSearchBar } from "./MusicSearchBar";

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
  const [searchedMusic, setSearchedMusic] = useState<MusicSubmissionType[]>([]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-[800px] min-h-[432px] rounded-2xl p-6 bg-white flex flex-col"
        hideCloseButton
      >
        <DialogTitle>Search for songs</DialogTitle>
        <div className="flex flex-col gap-4 w-full flex-1">
          <MusicSearchBar setSearchedMusic={setSearchedMusic} />

          <div className="flex-1 overflow-y-auto max-h-80">
            {searchedMusic.length > 0 ? (
              <div className="flex flex-col gap-2">
                {searchedMusic.map((musicSubmission) => (
                  <MusicSubmissionCard
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
              <p className="text-center p-32">Search for a song above!</p>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-end mt-4">
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
