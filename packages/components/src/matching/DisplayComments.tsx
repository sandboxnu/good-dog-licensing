import { useState } from "react";

import { trpc } from "@good-dog/trpc/client";
import { Input } from "@good-dog/ui/input";

interface DisplayCommentsProps {
  handleComment: () => Promise<void>;
  comments: {
    commentText: string;
    userName: string;
    timestamp: string;
    commentId: string;
  }[];
  matchId: string;
  userId: string;
}

export default function DisplayComments({
  handleComment,
  comments,
  matchId,
  userId,
}: DisplayCommentsProps) {
  const [newComment, setNewComment] = useState<string>("");

  const createCommentMutation = trpc.comment.useMutation({
    onSuccess: async () => {
      await handleComment();
    },
    onError: (err) => {
      // TODO - Display error
      console.error(err);
    },
  });

  const createComment = () => {
    if (newComment !== "") {
      createCommentMutation.mutate({
        matchId: matchId,
        matchComment: {
          commentText: newComment,
          userId: userId,
        },
      });
      setNewComment("");
    }
  };

  return (
    <div className="pb-[15px]">
      <div className="font-afacad pl-[34px] pt-[15px] text-xl font-normal text-black">
        Comments:
      </div>
      <div className="px-[34px] pt-[6px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createComment();
          }}
          className="flex h-[40px] w-full items-center rounded-xl border-[2px] border-[#000] bg-white"
        >
          <Input
            className="w-5/6 rounded-xl border-none pl-[10px] !text-lg shadow-none outline-none !ring-0"
            placeholder="Add a comment"
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
            value={newComment}
          />
          <div className="flex w-1/6 items-center justify-end pr-[10px]">
            <button onClick={createComment}>
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
        </form>
      </div>
      <div className="px-[34px]">
        {comments.map((comment) => {
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
    </div>
  );
}
