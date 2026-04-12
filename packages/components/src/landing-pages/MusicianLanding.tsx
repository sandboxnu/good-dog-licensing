"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { trpc } from "@good-dog/trpc/client";

import { formatAllCapsList } from "../../utils/allCapsListFormatter";
import Card from "../base/Card";
import StatusIndicator from "../base/StatusIndicator";
import EmptyMusicNote from "../svg/homepage/EmptyMusicNote";
import MusicNoteIcon from "../svg/MusicNoteIcon";
import People from "../svg/People";
import EmptyMessage from "./components/EmptyMessage";
import Header from "./components/Header";

export default function MusicianLanding() {
  const [data] = trpc.userMusic.useSuspenseQuery();
  const router = useRouter();
  return (
    <div className="align-start flex w-full flex-col gap-[32px]">
      <Header
        title={"Song submissions"}
        subtitle={"This is where you view and manage your song submissions"}
        requestPath={"/music-submission"}
        buttonContent="Song"
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
        <div className="mx-auto flex w-full max-w-[992px] flex-wrap justify-center gap-4 pb-[36px]">
          {data.music.map((song, key) => {
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
                  <div className="flex h-full flex-col justify-between gap-[24px] pt-[16px]">
                    <div className="flex flex-col gap-[8px]">
                      <Line text={song.performerName} icon={<People />} />
                      <Line
                        text={formatAllCapsList(song.genres)}
                        icon={
                          <div className="flex-shrink-0">
                            <MusicNoteIcon />
                          </div>
                        }
                      />
                    </div>

                    <div className="flex w-full flex-row justify-between">
                      <StatusIndicator status={song.musicianSongStatus} />
                      <ChevronRight
                        onClick={() => router.push("/song/" + song.musicId)}
                        className="text-black hover:cursor-pointer dark:text-mint-100"
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
