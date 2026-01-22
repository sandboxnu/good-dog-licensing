"use client";

import type { ReactNode } from "react";

import { MatchState } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyMusicNote from "../svg/homepage/EmptyMusicNote";
import MusicNote from "../svg/MusicNote";
import People from "../svg/People";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatAllCapsList } from "../../utils/allCapsListFormatter";

export default function MusicianLanding() {
  const [data] = trpc.userMusic.useSuspenseQuery();
  const router = useRouter();
  return (
    <div className="align-start flex w-full flex-col gap-[32px]">
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
        <div className="mx-auto flex max-w-fit flex-wrap justify-start gap-4 pb-[36px]">
          {data.music.map((song, key) => {
            const actionNeeded = song.matches.some(
              (match) => match.matchState === MatchState.SENT_TO_MUSICIAN,
            );
            return (
              <Card
                title={song.songName}
                subheader={
                  "Submitted " +
                  song.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
                children={
                  <div className="flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                      <Line text={song.performerName} icon={<People />} />
                      <Line
                        text={formatAllCapsList(song.genres)}
                        icon={
                          <div className="flex-shrink-0">
                            <MusicNote />
                          </div>
                        }
                      />
                    </div>

                    <div className="w-full flex flex-row justify-between">
                      <StatusIndicator
                        variant={actionNeeded ? "error" : "success"}
                        text={actionNeeded ? "Action needed" : "Song submitted"}
                      />
                      <ChevronRight
                        onClick={() => router.push("/song/" + song.musicId)}
                        className="hover:cursor-pointer"
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
    <div className="flex flex-row items-center gap-[8px]">
      {icon}
      <p className="text-body3 text-dark-gray-500 dark:text-mint-300">{text}</p>
    </div>
  );
}
