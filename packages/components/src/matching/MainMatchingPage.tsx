"use client";

import { useEffect, useState } from "react";

import { trpc } from "@good-dog/trpc/client";
import DisplaySceneInfo from "./DisplaySceneInfo";
import MatchedSong from "./MatchedSong";
import MusicSearch from "./MusicSearch";

interface MainMatchingPageProps {
  sceneId: string;
}

export default function MainMatchingPage({ sceneId }: MainMatchingPageProps) {
  // Get the user
  const [user] = trpc.user.useSuspenseQuery();

  // Get the actual scene related to the given sceneId
  const [sceneInfo, sceneQuery] = trpc.getSceneById.useSuspenseQuery({
    sceneId: sceneId,
  });

  // Get all the current matches for the scene
  const [matchedMusicIds, setMatchedMusicIds] = useState<string[]>(
    sceneInfo.suggestedMatches
      .sort(
        (matchA, matchB) =>
          matchB.createdAt.getTime() - matchA.createdAt.getTime(),
      )
      .map((match) => match.musicId),
  );

  // Get all the music in the database
  const music = trpc.music.useSuspenseQuery();

  // Music IDs of songs that are not yet matched, but ready to be matched
  const [selectedMusicIds, setSelectedMusicIds] = useState<string[]>([]);

  const handleSuccessfulMatch = async (musicId: string) => {
    await sceneQuery.refetch();

    const newSelectedMusicIds = selectedMusicIds.filter((id) => id !== musicId);
    setSelectedMusicIds(newSelectedMusicIds);
  };

  const handleCommentMade = async () => {
    await sceneQuery.refetch();
  };

  // TODO: Don't set state in useEffect??
  useEffect(() => {
    // eslint-disable-next-line
    setMatchedMusicIds(
      sceneInfo.suggestedMatches
        .sort(
          (matchA, matchB) =>
            matchB.createdAt.getTime() - matchA.createdAt.getTime(),
        )
        .map((match) => match.musicId),
    );
  }, [sceneInfo]);

  return (
    <>
      {
        <div className="flex h-screen w-full bg-[#DEE0E2] px-[80px] py-[60px]">
          <DisplaySceneInfo
            projectId={sceneInfo.projectId}
            projectTitle={sceneInfo.projectSubmission.projectTitle}
            sceneTitle={sceneInfo.sceneTitle}
            description={sceneInfo.description}
            similarSongs={sceneInfo.similarSongs}
            musicType={sceneInfo.musicType}
            additionalInfo={sceneInfo.additionalInfo}
          />
          <div className="w-1/2 overflow-y-auto bg-[#EDF3F9] pb-[20px]">
            <div className="font-afacad pl-[60px] pt-[71px] text-3xl font-semibold text-black">
              Music
            </div>
            <MusicSearch
              music={music[0].music.map((song) => {
                return {
                  musicTitle: song.songName,
                  artistName:
                    song.submitter.firstName + " " + song.submitter.lastName,
                  musicId: song.musicId,
                };
              })}
              matchedMusicIds={[...matchedMusicIds, ...selectedMusicIds]}
              handleSelection={(musicId: string) => {
                setSelectedMusicIds([musicId, ...selectedMusicIds]);
              }}
              label="Music"
            />
            <div className="pl-[60px] pr-[80px] pt-[10px]">
              {selectedMusicIds.map((musicId) => {
                const song = music[0].music.find(
                  (song) => song.musicId === musicId,
                );

                return (
                  <div key={musicId} className="w-full pt-[15px]">
                    <MatchedSong
                      songName={song?.songName ?? ""}
                      artistName={
                        song?.submitter.firstName +
                        " " +
                        song?.submitter.lastName
                      }
                      projectId={sceneInfo.projectId}
                      sceneId={sceneInfo.sceneId}
                      musicId={song?.musicId ?? ""}
                      isMatched={false}
                      handleMatch={handleSuccessfulMatch}
                      matchId=""
                      userId={user?.userId ?? ""}
                      handleComment={handleCommentMade}
                      comments={[]}
                      genres={song?.genre ?? ""}
                      songLink={song?.songLink ?? ""}
                    />
                  </div>
                );
              })}
              {sceneInfo.suggestedMatches.map((match) => {
                const comments = match.matchComments.map((comment) => {
                  return {
                    commentText: comment.commentText,
                    userName:
                      comment.user.firstName + " " + comment.user.lastName,
                    timestamp: comment.createdAtDateString,
                    commentId: comment.commentId,
                  };
                });

                return (
                  <div key={match.musicId} className="w-full pt-[15px]">
                    <MatchedSong
                      songName={match.musicSubmission.songName}
                      artistName={
                        match.musicSubmission.submitter.firstName +
                        " " +
                        match.musicSubmission.submitter.lastName
                      }
                      projectId={match.projectId}
                      sceneId={match.sceneId}
                      musicId={match.musicId}
                      isMatched={true}
                      handleMatch={handleSuccessfulMatch}
                      userId={user?.userId ?? ""}
                      matchId={match.suggestedMatchId}
                      handleComment={handleCommentMade}
                      comments={comments}
                      genres={match.musicSubmission.genre}
                      songLink={match.musicSubmission.songLink}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    </>
  );
}
