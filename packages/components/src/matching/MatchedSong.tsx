"use client";

import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";

interface MatchedSongProps {
  licensed: boolean;
  songName: string;
  artistName: string;
  musicId: string;
  projectId: string;
  sceneId: string;
  isMatched: boolean;
  handleMatch: (musicId: string) => Promise<void>;
  matchId: string;
  userId: string;
  handleComment: () => Promise<void>;
  comments: {
    commentText: string;
    userName: string;
    timestamp: string;
    commentId: string;
  }[];
}

export default function MatchedSong(props: MatchedSongProps) {
  const [showMoreDetails, setShowMoreDetails] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const createLicensedMatchMutation = trpc.suggestMatch.useMutation({
    onSuccess: async () => {
      await props.handleMatch(props.musicId);
    },
    onError: (err) => {
      //TODO - Display error
      console.error(err);
    },
  });

  const createUnlicensedMatchMutation = trpc.unlicensedSuggestMatch.useMutation(
    {
      onSuccess: async () => {
        await props.handleMatch(props.musicId);
      },
      onError: (err) => {
        //TODO - Display error
        console.error(err);
      },
    },
  );

  const createCommentMutation = trpc.comment.useMutation({
    onSuccess: async () => {
      await props.handleComment();
    },
    onError: (err) => {
      // TODO - Display error
      console.error(err);
    },
  });

  const handleMatch = () => {
    if (props.licensed) {
      createLicensedMatchMutation.mutate({
        projectId: props.projectId,
        sceneId: props.sceneId,
        musicId: props.musicId,
        description: "",
      });
    } else {
      createUnlicensedMatchMutation.mutate({
        projectId: props.projectId,
        sceneId: props.sceneId,
        musicId: props.musicId,
        description: "",
      });
    }
  };

  const handleComment = () => {
    if (comment !== "") {
      createCommentMutation.mutate({
        matchId: props.matchId,
        matchComment: {
          commentText: comment,
          userId: props.userId,
        },
        unlicensed: !props.licensed,
      });
      setComment("");
    }
  };

  return (
    <>
      <div className="flex min-h-[60px] w-full items-center rounded-xl bg-white">
        <div className="font-afacad w-1/2 pl-[20px] text-xl font-normal text-black">
          {'"' + props.songName + '" by ' + props.artistName}
        </div>
        <div className="w-1/4 pl-[20px]">
          {!props.isMatched && (
            <button
              onClick={handleMatch}
              className="font-afacad w-[75px] rounded-xl border-[1px] border-[#015643] text-center text-lg font-normal"
            >
              Match
            </button>
          )}
          {props.isMatched && (
            <div className="font-afacad w-[100px] rounded-xl border-[1px] border-[#015643] bg-[#015643] text-center text-lg font-normal text-white">
              Matched
            </div>
          )}
        </div>
        <div className="flex w-1/4 justify-end pr-[20px]">
          <button
            onClick={() => {
              setShowMoreDetails(!showMoreDetails);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="24"
              viewBox="0 0 26 24"
              fill="none"
            >
              <path d="M7.13086 9L13.3764 15L19.622 9" stroke="#333333" />
            </svg>
          </button>
        </div>
      </div>
      {showMoreDetails && (
        <div className="w-full rounded-xl bg-[#D9D9D9]">
          <div className="flex items-center pt-[20px]">
            <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
              Name:
            </div>
            <div className="font-afacad w-5/6 pl-[50px] text-lg font-normal">
              {props.songName}
            </div>
          </div>
          <div className="flex items-center pt-[15px]">
            <div className="font-afacad w-1/6 pl-[34px] text-xl font-normal text-black">
              Artist:
            </div>
            <div className="font-afacad w-5/6 pl-[50px] text-lg font-normal">
              {props.artistName}
            </div>
          </div>
          {props.isMatched && (
            <>
              <div className="font-afacad pl-[34px] pt-[15px] text-xl font-normal text-black">
                Comments:
              </div>
              <div className="px-[34px] pt-[6px]">
                <div className="flex h-[40px] w-full items-center rounded-xl border-[2px] border-[#000] bg-white">
                  <input
                    className="w-5/6 rounded-xl border-none pl-[10px] text-lg outline-none"
                    placeholder="Add a comment"
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    value={comment}
                  ></input>
                  <div className="flex w-1/6 items-center justify-end pr-[10px]">
                    <button onClick={handleComment}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="29"
                        viewBox="0 0 30 29"
                        fill="none"
                      >
                        <path
                          d="M9.97594 13.7461L14.8291 9.0625M14.8291 9.0625L19.6823 13.7461M14.8291 9.0625V19.3533M21.6925 25.375L7.96568 25.375C5.69136 25.375 3.84766 23.5492 3.84766 21.2969L3.84766 7.70312C3.84766 5.45084 5.69136 3.625 7.96568 3.625L21.6925 3.625C23.9669 3.625 25.8106 5.45084 25.8106 7.70313V21.2969C25.8106 23.5492 23.9669 25.375 21.6925 25.375Z"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-[34px]">
                {props.comments.map((comment) => {
                  return (
                    <div key={comment.commentId} className="flex pt-[10px]">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="35"
                          height="35"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M7.19922 25.5992C7.81411 24.9106 10.6939 21.7415 11.5379 21.7415H20.4611C21.684 21.7415 24.1805 24.3684 24.7992 25.2944M28.7992 15.9992C28.7992 23.0685 23.0685 28.7992 15.9992 28.7992C8.92997 28.7992 3.19922 23.0685 3.19922 15.9992C3.19922 8.92997 8.92997 3.19922 15.9992 3.19922C23.0685 3.19922 28.7992 8.92997 28.7992 15.9992ZM20.5843 11.6365C20.5843 9.19448 18.5228 7.19922 15.9996 7.19922C13.4764 7.19922 11.4149 9.19448 11.4149 11.6365C11.4149 14.0785 13.4764 16.0738 15.9996 16.0738C18.5228 16.0738 20.5843 14.0785 20.5843 11.6365Z"
                            stroke="#222124"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="pl-[10px]">
                        <div className="flex">
                          <div className="font-afacad text-sm font-normal text-black">
                            {comment.userName}
                          </div>
                          <div className="font-afacad pl-[20px] text-sm font-normal text-black">
                            {comment.timestamp}
                          </div>
                        </div>
                        <div className="font-afacad text-lg text-black">
                          {comment.commentText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
