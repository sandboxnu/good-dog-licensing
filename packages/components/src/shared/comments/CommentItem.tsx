import { GetProcedureOutput } from "@good-dog/trpc/types";
import ProfileIcon from "../../svg/ProfileIcon";
import CommentText from "./CommentText";

type Comment = GetProcedureOutput<"getSongRequestById">["comments"][number];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommentItem({ comment }: { comment: Comment }) {
  const name = `${comment.user.firstName} ${comment.user.lastName}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-3 items-start">
        <ProfileIcon color="light" size={32} name={name} />
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-row items-center gap-1 flex-wrap">
            <span className="text-sm font-medium dark:text-gray-200">
              {name}
            </span>
            <span className="text-xs text-cream-600 dark:text-gray-400 mx-1">
              ·
            </span>
            <span className="text-xs text-cream-600 dark:text-gray-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <CommentText text={comment.commentText} />
        </div>
      </div>
    </div>
  );
}
