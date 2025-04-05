"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";

import DisplaySceneInfo from "./DisplaySceneInfo";
import MatchedSong from "./MatchedSong";
import MusicSearch from "./MusicSearch";

interface MainMatchingPageProps {
  sceneId: string;
}

export default function MainMatchingPage({ sceneId }: MainMatchingPageProps) {
  // Get the user
  const user = trpc.user.useSuspenseQuery();

  // Get the actual scene related to the given sceneId
  const sceneQuery = trpc.getSceneById.useSuspenseQuery({
    sceneId: sceneId,
  });
  const sceneInfo = sceneQuery[0];

  // Get all the current matches for the scene
  let matchedLicensedMusicIds: string[] = [];
  let matchedUnlicensedMusicIds: string[] = [];
  const updateMatchedMusicIds = () => {
    matchedLicensedMusicIds = sceneInfo.suggestedMatches
      .sort(
        (matchA, matchB) =>
          matchB.createdAt.getTime() - matchA.createdAt.getTime(),
      )
      .map((match) => match.musicId);
    matchedUnlicensedMusicIds = sceneInfo.unlicensedSuggestedMatches
      .sort(
        (matchA, matchB) =>
          matchB.createdAt.getTime() - matchA.createdAt.getTime(),
      )
      .map((match) => match.musicId);
  };
  updateMatchedMusicIds();

  // Get all the music in the database
  const licensedMusic = trpc.music.useSuspenseQuery();
  const unlicensedMusic = trpc.unlicensedMusic.useSuspenseQuery();

  // Music IDs of songs that are not yet matched, but ready to be matched
  const [selectedLicensedMusicIds, setSelectedLicensedMusicIds] = useState<
    string[]
  >([]);
  const [selectedUnlicensedMusicIds, setSelectedUnlicensedMusicIds] = useState<
    string[]
  >([]);

  const handleSuccessfulMatch = async (musicId: string) => {
    await sceneQuery[1].refetch();
    updateMatchedMusicIds();

    const newSelectedLicensedMusicIds = selectedLicensedMusicIds.filter(
      (id) => id !== musicId,
    );
    const newSelectedUnlicensedMusicIds = selectedUnlicensedMusicIds.filter(
      (id) => id !== musicId,
    );
    setSelectedLicensedMusicIds(newSelectedLicensedMusicIds);
    setSelectedUnlicensedMusicIds(newSelectedUnlicensedMusicIds);
  };

  const handleCommentMade = async () => {
    await sceneQuery[1].refetch();
    updateMatchedMusicIds();
  };

  return (
    <div className="flex h-screen w-full bg-[#DEE0E2] px-[80px] py-[60px]">
      <DisplaySceneInfo
        projectId={sceneInfo.projectId}
        projectTitle={sceneInfo.projectTitle}
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
          music={licensedMusic[0].music.map((song) => {
            return {
              musicTitle: song.songName,
              artistName: song.artist.firstName + " " + song.artist.lastName,
              musicId: song.musicId,
            };
          })}
          matchedMusicIds={[
            ...matchedLicensedMusicIds,
            ...selectedLicensedMusicIds,
          ]}
          handleSelection={(musicId: string) => {
            setSelectedLicensedMusicIds([musicId, ...selectedLicensedMusicIds]);
          }}
          label="Licensed Music"
        />
        <div className="pl-[60px] pr-[80px] pt-[10px]">
          {selectedLicensedMusicIds.map((musicId) => {
            const song = licensedMusic[0].music.find(
              (song) => song.musicId === musicId,
            );

            return (
              <div key={musicId} className="w-full pt-[15px]">
                <MatchedSong
                  licensed={true}
                  songName={song?.songName ?? ""}
                  artistName={
                    song?.artist.firstName + " " + song?.artist.lastName
                  }
                  projectId={sceneInfo.projectId}
                  sceneId={sceneInfo.sceneId}
                  musicId={song?.musicId ?? ""}
                  isMatched={false}
                  handleMatch={handleSuccessfulMatch}
                  matchId=""
                  userId={user[0]?.userId ?? ""}
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
                userName: comment.user.firstName + " " + comment.user.lastName,
                timestamp: comment.createdAt.toDateString(),
                commentId: comment.commentId,
              };
            });

            return (
              <div key={match.musicId} className="w-full pt-[15px]">
                <MatchedSong
                  licensed={true}
                  songName={match.musicSubmission.songName}
                  artistName={
                    match.musicSubmission.artist.firstName +
                    " " +
                    match.musicSubmission.artist.lastName
                  }
                  projectId={match.projectId}
                  sceneId={match.sceneId}
                  musicId={match.musicId}
                  isMatched={true}
                  handleMatch={handleSuccessfulMatch}
                  userId={user[0]?.userId ?? ""}
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
        <div className="pt-[20px]">
          <MusicSearch
            music={unlicensedMusic[0].music.map((song) => {
              return {
                musicTitle: song.songName,
                artistName: song.artist,
                musicId: song.musicId,
              };
            })}
            matchedMusicIds={[
              ...matchedUnlicensedMusicIds,
              ...selectedUnlicensedMusicIds,
            ]}
            handleSelection={(musicId: string) => {
              setSelectedUnlicensedMusicIds([
                musicId,
                ...selectedUnlicensedMusicIds,
              ]);
            }}
            label="Not Yet Licensed Music"
          />
        </div>
        <div className="pl-[60px] pr-[80px] pt-[10px]">
          {selectedUnlicensedMusicIds.map((musicId) => {
            const song = unlicensedMusic[0].music.find(
              (song) => song.musicId === musicId,
            );

            return (
              <div key={musicId} className="w-full pt-[15px]">
                <MatchedSong
                  licensed={false}
                  songName={song?.songName ?? ""}
                  artistName={song?.artist ?? ""}
                  projectId={sceneInfo.projectId}
                  sceneId={sceneInfo.sceneId}
                  musicId={song?.musicId ?? ""}
                  isMatched={false}
                  handleMatch={handleSuccessfulMatch}
                  matchId=""
                  userId={user[0]?.userId ?? ""}
                  handleComment={handleCommentMade}
                  comments={[]}
                  genres={song?.genre ?? ""}
                  songLink={song?.songLink ?? ""}
                />
              </div>
            );
          })}
          {sceneInfo.unlicensedSuggestedMatches.map((match) => {
            const comments = match.matchComments.map((comment) => {
              return {
                commentText: comment.commentText,
                userName: comment.user.firstName + " " + comment.user.lastName,
                timestamp: comment.createdAt.toDateString(),
                commentId: comment.commentId,
              };
            });

            return (
              <div key={match.musicId} className="w-full pt-[15px]">
                <MatchedSong
                  licensed={false}
                  songName={match.musicSubmission.songName}
                  artistName={match.musicSubmission.artist}
                  projectId={match.projectId}
                  sceneId={match.sceneId}
                  musicId={match.musicId}
                  isMatched={true}
                  handleMatch={handleSuccessfulMatch}
                  userId={user[0]?.userId ?? ""}
                  matchId={match.unlicensedSuggestedMatchId}
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
  );
}
