"use client";

import { trpc } from "@good-dog/trpc/client";
import Card from "../base/Card";
import Header from "./components/Header";
import type { ReactNode } from "react";
import People from "../svg/People";
import MusicNote from "../svg/MusicNote";
import StatusIndicator from "../base/StatusIndicator";
import { MatchState } from "@good-dog/db";

export default function MusicianLanding() {
  const [data] = trpc.userMusic.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-[32px] align-start w-full">
      <Header
        title={"Song Submissions"}
        subtitle={"This is where you view and manage your song submissions"}
        requestPath={"/music"}
      />
      <div className="flex flex-wrap justify-start gap-4 mx-auto max-w-fit pb-[36px]">
        {data.music.map((req, key) => {
          const actionNeeded = !!req.matches.find(
            (match) => match.matchState === MatchState.SONG_REQUESTED,
          );
          return (
            <Card
              title={req.songName}
              subheader={req.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              children={
                <div className="flex flex-col pt-[16px] gap-[24px]">
                  <div>
                    <Line text={req.performerName} icon={<People />} />
                    <Line text={req.genre} icon={<MusicNote />} />
                  </div>
                  <StatusIndicator
                    variant={actionNeeded ? "error" : "success"}
                    text={actionNeeded ? "Action needed" : "Song submitted"}
                  />
                </div>
              }
              size={"small"}
              key={key}
            />
          );
        })}
      </div>
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
