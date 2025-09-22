"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

import { Rating } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";
import { cn } from "@good-dog/ui";
import { Button } from "@good-dog/ui/button";
import { Card } from "@good-dog/ui/card";
import { ScrollArea } from "@good-dog/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@good-dog/ui/tooltip";

// data used to create / update rating state of the music to scene matches
interface MatchRatingInfo {
  ratingId: string | null;
  rating: Rating | null;
  matchId: string;
}

// music data given to child components
interface MusicData {
  musicId: string;
  songName: string;
  artist: string;
  songLink: string;
  genre: string;
  additionalInfo: string;
}

// all the props needed for music cards
interface MusicChildProps {
  musicData: MusicData;
  rating: Rating | null;
  ratingId: string | null;
  matchId: string;
  onData: (data: MatchRatingInfo) => void;
}

export default function MusicSection({
  projectId,
  sceneId,
}: {
  projectId: string;
  sceneId: string;
}) {
  //stores the user actions on each music card
  const [ratingInputs, setRatingInputs] = useState<
    { matchId: string; matchData: MatchRatingInfo }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //updates the data every time user makes an action
  const handleData = (data: MatchRatingInfo) => {
    const matchExists: boolean = ratingInputs.some(
      (match) => match.matchId === data.matchId,
    );

    if (matchExists) {
      //update
      const newRatingInputs = ratingInputs.map((match) =>
        match.matchId === data.matchId ? { ...match, matchData: data } : match,
      );
      setRatingInputs(newRatingInputs);
    } else {
      //create
      const newRatingInputs = [
        ...ratingInputs,
        { matchId: data.matchId, matchData: data },
      ];
      setRatingInputs(newRatingInputs);
    }
  };

  const rateMatch = trpc.rateMatch.useMutation();
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const promises = ratingInputs.map((matchItem) => {
        if (
          matchItem.matchData.ratingId !== null &&
          matchItem.matchData.rating !== null
        ) {
          return rateMatch.mutateAsync({
            ratingId: matchItem.matchData.ratingId,
            ratingEnum: matchItem.matchData.rating,
            matchId: matchItem.matchId,
          });
        } else if (matchItem.matchData.rating !== null) {
          return rateMatch.mutateAsync({
            ratingEnum: matchItem.matchData.rating,
            matchId: matchItem.matchId,
          });
        }
        return Promise.resolve(); //no action
      });

      await Promise.all(promises);

      router.push("/success");
    } catch (error) {
      console.error("Error submitting ratings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchData = trpc.mediamakerMatches.useSuspenseQuery({
    projectId: projectId,
    sceneId: sceneId,
  });

  const licensedInfo = matchData[0].licensed;

  return (
    <div className="flex w-full flex-col bg-gray-200 p-6 md:w-1/2 md:p-10">
      <h2 className="mb-8 text-2xl font-bold">Music</h2>

      <div className="flex-1 space-y-8 overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-bold">Licensed Music</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircledIcon className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Music which we have permission from the artists to use for
                    this project!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            {licensedInfo.map((item) => {
              const musicData: MusicData = {
                musicId: item.musicSubmission.musicId,
                songName: item.musicSubmission.songName,
                artist:
                  item.musicSubmission.submitter.firstName +
                  " " +
                  item.musicSubmission.submitter.lastName,
                songLink: item.musicSubmission.songLink || "",
                genre: item.musicSubmission.genre || "",
                additionalInfo: item.musicSubmission.additionalInfo || "",
              };

              //check if there's an existing rating
              const existingRating: Rating | null =
                item.matchLikes.length > 0
                  ? item.matchLikes[0]?.ratingEnum ?? null
                  : null;
              const ratingId: string | null =
                item.matchLikes.length > 0
                  ? item.matchLikes[0]?.ratingId ?? null
                  : null;

              return (
                <MusicChild
                  key={item.suggestedMatchId}
                  musicData={musicData}
                  rating={existingRating}
                  ratingId={ratingId}
                  matchId={item.suggestedMatchId}
                  onData={handleData}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}

function MusicChild({
  musicData,
  rating,
  ratingId,
  matchId,
  onData,
}: MusicChildProps) {
  const [_rating, _setRating] = useState<Rating | null>(rating);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFeedback = (value: Rating) => {
    // If the same button is clicked again, toggle it off
    if (_rating === value) {
      _setRating(null);
      const dataToSend: MatchRatingInfo = {
        rating: null,
        ratingId: ratingId,
        matchId: matchId,
      };
      onData(dataToSend);
    } else {
      _setRating(value);
      const dataToSend: MatchRatingInfo = {
        rating: value,
        ratingId: ratingId,
        matchId: matchId,
      };
      onData(dataToSend);
    }
  };

  return (
    <div className="space-y-2">
      <Card className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{`"${musicData.songName}" by ${musicData.artist}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-colors",
                _rating === "LIKE"
                  ? "bg-green-100 text-green-600"
                  : "text-green-500 hover:bg-green-50 hover:text-green-600",
              )}
              onClick={() => handleFeedback(Rating.LIKE)}
            >
              <ArrowUpIcon className="h-5 w-5" />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 transition-colors",
                _rating === "DISLIKE"
                  ? "bg-red-100 text-red-600"
                  : "text-red-500 hover:bg-red-50 hover:text-red-600",
              )}
              onClick={() => handleFeedback(Rating.DISLIKE)}
            >
              <ArrowDownIcon className="h-5 w-5" />
              <span className="sr-only">Dislike</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDownIcon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isExpanded ? "rotate-180 transform" : "",
                )}
              />
              <span className="sr-only">Show details</span>
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Artist</h4>
                  <p className="text-sm text-gray-600">{musicData.artist}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Genre</h4>
                  <p className="text-sm text-gray-600">{musicData.genre}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Song Link</h4>
                  <p className="text-sm text-gray-600">{musicData.songLink}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium">
                    Additional Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    {musicData.additionalInfo}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
}
