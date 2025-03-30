"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";

import MatchedSong from "./MatchedSong";

interface PageProps {
  sceneId: string;
  userId: string;
}

interface MusicOption {
  musicId: string;
  musicTitle: string;
  artistName: string;
}

export default function MainMatchingPage({ sceneId, userId }: PageProps) {
  const sceneInfo = trpc.getSceneById.useSuspenseQuery({
    sceneId: sceneId,
  });
  let suggestMatcheMusicIds: string[] = [];
  sceneInfo[0].suggestedMatches.forEach((match) => {
    suggestMatcheMusicIds.push(match.musicId);
  });

  const licensedMusic = trpc.music.useSuspenseQuery();

  const [licensedSearch, setLicensedSearch] = useState<string>("");
  const [licensedMusicOptions, setLicensedMusicOptions] = useState<
    MusicOption[]
  >([]);

  const [selectedLicensedMusicIds, setSelectedLicensedMusicIds] = useState<
    string[]
  >([]);

  const handleSuccessfulMatch = async (musicId: string) => {
    await sceneInfo[1].refetch();
    suggestMatcheMusicIds = [];
    sceneInfo[0].suggestedMatches.forEach((match) => {
      suggestMatcheMusicIds.push(match.musicId);
    });

    const newSelectedLicensedMusicIds = selectedLicensedMusicIds.filter(
      (id) => id !== musicId,
    );
    setSelectedLicensedMusicIds(newSelectedLicensedMusicIds);
  };

  const handleCommentMade = async () => {
    await sceneInfo[1].refetch();
    suggestMatcheMusicIds = [];
    sceneInfo[0].suggestedMatches.forEach((match) => {
      suggestMatcheMusicIds.push(match.musicId);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchParam = e.target.value;
    setLicensedSearch(searchParam);

    const potentialMusicMatches = licensedMusic[0].music.filter((music) => {
      return (
        music.songName.toLowerCase().includes(searchParam.toLowerCase()) ||
        music.artist.firstName
          .toLowerCase()
          .includes(searchParam.toLowerCase()) ||
        music.artist.lastName.toLowerCase().includes(searchParam.toLowerCase())
      );
    });
    const newLicensedMusicOptions: MusicOption[] = [];
    potentialMusicMatches.forEach((match) => {
      if (
        !selectedLicensedMusicIds.includes(match.musicId) &&
        !suggestMatcheMusicIds.includes(match.musicId)
      ) {
        newLicensedMusicOptions.push({
          musicId: match.musicId,
          musicTitle: match.songName,
          artistName: match.artist.firstName + " " + match.artist.lastName,
        });
      }
    });
    setLicensedMusicOptions(newLicensedMusicOptions);
  };

  return (
    <div className="flex h-screen w-screen bg-[#DEE0E2] px-[80px] py-[60px]">
      <div className="w-1/2 overflow-y-auto bg-white">
        <div className="pl-[33px] pt-[24]">
          <button className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M15 6L9 12L15 18" stroke="#333333" />
            </svg>
            <div className="font-afacad text-base font-normal text-black">
              {sceneInfo[0].projectTitle}
            </div>
          </button>
        </div>
        <div className="font-afacad pl-[58px] pt-[26px] text-3xl font-semibold text-black">
          Scene
        </div>
        <div className="px-[50px] pt-[29px]">
          <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
        </div>
        <div className="font-afacad pl-[57px] pt-[14px] text-2xl font-medium text-black">
          Scene Name
        </div>
        <div className="font-afacad pl-[57px] pt-[4px] text-lg font-normal text-black">
          {sceneInfo[0].sceneTitle}
        </div>
        <div className="px-[50px] pt-[14px]">
          <div className="h-[0.5px] w-full bg-[#A3A3A3]"></div>
        </div>
        <div className="font-afacad pl-[57px] pt-[19px] text-2xl font-medium text-black">
          Description
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].description}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Type of Music Needed
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].musicType}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Similar Types of Songs
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].similarSongs}
        </div>
        <div className="font-afacad pl-[57px] pt-[32px] text-2xl font-medium text-black">
          Additional Info
        </div>
        <div className="font-afacad px-[60px] pt-[5px] text-lg font-normal text-[#5F5F5F]">
          {sceneInfo[0].additionalInfo}
        </div>
      </div>
      <div className="w-1/2 overflow-y-auto bg-[#EDF3F9] pb-[20px]">
        <div className="font-afacad pl-[60px] pt-[71px] text-3xl font-semibold text-black">
          Music
        </div>
        <div className="flex items-center pl-[58px] pt-[43px]">
          <div className="font-afacad text-2xl font-medium">Licensed Music</div>
          <div className="pl-[8px]">
            <div className="group flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 9L9 12.375M9 6.49841V6.46875M2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9Z"
                  stroke="#A3A3A3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-[-20px] hidden pl-[20px] group-hover:block">
                <div className="h-[59px] w-[350px] rounded-xl bg-[#D9D9D9]">
                  test
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-[60px] pr-[80px] pt-[20px]">
          <input
            className="h-[40px] w-full rounded-xl border-[1px] border-[#A3A3A382] pl-[10px] text-lg"
            placeholder="Search"
            onChange={handleSearch}
          />
          {licensedSearch !== "" && (
            <div className="flex w-full flex-col rounded-xl bg-white">
              {licensedMusicOptions.map((music) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedLicensedMusicIds([
                        ...selectedLicensedMusicIds,
                        music.musicId,
                      ]);
                      setLicensedSearch("");
                    }}
                    key={music.musicId}
                    className="w-full pl-[10px] pt-[4px] text-left text-lg"
                  >
                    {'"' + music.musicTitle + '" by ' + music.artistName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="pl-[60px] pr-[80px] pt-[10px]">
          {selectedLicensedMusicIds.map((musicId) => {
            // Get the music we need
            let music = licensedMusic[0].music[0];
            licensedMusic[0].music.forEach((m) => {
              if (m.musicId === musicId) {
                music = m;
              }
            });

            return (
              <div key={musicId} className="w-full pt-[15px]">
                <MatchedSong
                  songName={music?.songName ?? ""}
                  artistName={
                    music?.artist.firstName + " " + music?.artist.lastName
                  }
                  songwriters={music?.songwriters ?? []}
                  projectId={sceneInfo[0].projectId}
                  sceneId={sceneInfo[0].sceneId}
                  musicId={music?.musicId ?? ""}
                  isMatched={false}
                  handleMatch={handleSuccessfulMatch}
                  matchId=""
                  userId={userId}
                  handleComment={handleCommentMade}
                  comments={[]}
                />
              </div>
            );
          })}
          {sceneInfo[0].suggestedMatches.map((match) => {
            const comments: {
              commentText: string;
              userName: string;
              timestamp: string;
              commentId: string;
            }[] = [];
            match.matchComments.forEach((comment) => {
              comments.push({
                commentText: comment.commentText,
                userName: comment.user.firstName + " " + comment.user.lastName,
                timestamp: comment.createdAt.toLocaleDateString("en-US"),
                commentId: comment.commentId,
              });
            });

            return (
              <div key={match.musicId} className="w-full pt-[15px]">
                <MatchedSong
                  songName={match.musicSubmission.songName}
                  artistName={
                    match.musicSubmission.artist.firstName +
                    " " +
                    match.musicSubmission.artist.lastName
                  }
                  songwriters={match.musicSubmission.songwriters}
                  projectId={match.projectId}
                  sceneId={match.sceneId}
                  musicId={match.musicId}
                  isMatched={true}
                  handleMatch={handleSuccessfulMatch}
                  userId={userId}
                  matchId={match.matchId}
                  handleComment={handleCommentMade}
                  comments={comments}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
