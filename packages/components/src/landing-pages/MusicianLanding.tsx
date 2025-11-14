"use client";

import { trpc } from "@good-dog/trpc/client";
import Card from "../base/Card";
import Header from "./components/Header";
import type { ReactNode } from "react";
import People from "../svg/People";
import MusicNote from "../svg/MusicNote";
import StatusIndicator from "../base/StatusIndicator";
import { MatchState } from "@good-dog/db";
import EmptyMessage from "./components/EmptyMessage";
import EmptyMusicNote from "../svg/homepage/EmptyMusicNote";

export default function MusicianLanding() {
  const [data] = trpc.userMusic.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px] align-start w-full">
      <Header
        title={"Song submissions"}
        subtitle={"This is where you view and manage your song submissions"}
        requestPath={"/music-submission"}
      />
      {data.music.length === 0 && (
        <EmptyMessage
          title={"Find songs submissions here"}
          description={
            "Once you submit a song, you can track its status, view details, and manage all your songs here."
          }
          icon={<EmptyMusicNote />}
        />
      )}
      {data.music.length > 0 && (
        <div className="flex flex-wrap justify-start gap-4 mx-auto max-w-fit pb-[36px]">
          {data.music.map((song, key) => {
            const actionNeeded = !!song.matches.find(
              (match) => match.matchState === MatchState.SONG_REQUESTED,
            );
            return (
              <Card
                title={song.songName}
                subheader={song.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                children={
                  <div className="flex flex-col h-full gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                      <Line text={song.performerName} icon={<People />} />
                      <Line text={song.genre} icon={<MusicNote />} />
                    </div>

                    {/* absolutely position the indicator 24px from the bottom */}
                    <div className="absolute bottom-[24px]">
                      <StatusIndicator
                        variant={actionNeeded ? "error" : "success"}
                        text={actionNeeded ? "Action needed" : "Song submitted"}
                      />
                    </div>
                  </div>
                }
                size="small"
                key={key}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Line({ text, icon }: { text: string; icon: ReactNode }) {
  return (
    <div className="flex flex-row gap-[8px] items-center">
      {icon}
      <p className="text-body3 text-dark-gray-500 dark:text-mint-300">{text}</p>
    </div>
  );
}
