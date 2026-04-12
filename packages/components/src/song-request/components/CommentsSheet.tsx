"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Sheet, SheetContent } from "@good-dog/ui/sheet";
import { trpc } from "@good-dog/trpc/client";
import type { GetProcedureOutput } from "@good-dog/trpc/types";

type Comment = GetProcedureOutput<"getSongRequestById">["comments"][number];

// Detect URLs in text and render them as clickable links
function CommentText({ text }: { text: string }) {
  const URL_REGEX = /https?:\/\/[^\s]+/g;
  const parts: { text: string; isLink: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isLink: false });
    }
    parts.push({ text: match[0], isLink: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isLink: false });
  }

  return (
    <p className="text-sm text-dark-gray-400 dark:text-gray-200 break-words">
      {parts.map((part, i) =>
        part.isLink ? (
          <a
            key={i}
            href={part.text}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 text-green-500 dark:text-mint-300"
          >
            {part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

function CommentAvatar({ name }: { name: string }) {
  const letter = name.charAt(0).toUpperCase();
  return (
    <div className="flex-shrink-0">
      <svg
        width={32}
        height={32}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="url(#comment-avatar-grad)" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#FFF"
          fontSize="25"
          fontFamily="Righteous"
          fontWeight="400"
        >
          {letter}
        </text>
        <defs>
          <linearGradient
            id="comment-avatar-grad"
            x1="20"
            y1="-8.33333"
            x2="20"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#C1E0D8" />
            <stop offset="0.400448" stopColor="#84C1B2" />
            <stop offset="1" stopColor="#098465" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

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

function CommentItem({ comment }: { comment: Comment }) {
  const name = `${comment.user.firstName} ${comment.user.lastName}`;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-3 items-start">
        <CommentAvatar name={name} />
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

interface CommentsSheetProps {
  open: boolean;
  onClose: () => void;
  songRequestId: string;
  comments: Comment[];
  subtitle?: string;
}

export default function CommentsSheet({
  open,
  onClose,
  songRequestId,
  comments,
  subtitle = "You can communicate to media makers by commenting.",
}: CommentsSheetProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const addComment = trpc.comment.useMutation({
    onSuccess: async () => {
      await utils.getSongRequestById.invalidate({ songRequestId });
      setText("");
    },
  });

  // Auto-resize textarea up to ~3 lines, then scroll
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 20;
    const maxHeight = lineHeight * 3 + 24; // 3 lines + padding
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [text]);

  // Scroll to bottom when comments change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || addComment.isPending) return;
    addComment.mutate({ commentText: trimmed, songRequestId });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = text.trim().length > 0 && !addComment.isPending;

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent
        side="right"
        className="w-[400px] p-0 flex flex-col bg-white dark:bg-dark-gray-600 border-l border-cream-300 dark:border-dark-gray-600"
      >
        {/* Header */}
        <div className="flex flex-col gap-1 px-6 pt-6 pb-4">
          <div className="flex flex-row justify-between items-center">
            <p className="text-lg font-medium dark:text-gray-200">Comments</p>
          </div>
          <p className="text-sm text-cream-600 dark:text-cream-500">
            {subtitle}
          </p>
          <hr className="border-cream-400 dark:border-dark-gray-400 mt-2" />
        </div>

        {/* Scrollable comment list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5"
        >
          {comments.length === 0 && (
            <p className="text-sm text-cream-600 dark:text-gray-400 italic">
              No comments yet.
            </p>
          )}
          {comments.map((c, i) => (
            <div key={c.commentId} className="flex flex-col gap-5">
              {i > 0 && comments[i - 1]?.userId !== c.userId && (
                <hr className="border-cream-400 dark:border-dark-gray-400" />
              )}
              <CommentItem comment={c} />
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="px-6 pb-6 pt-2">
          <div className="relative rounded-lg border border-cream-400 dark:border-dark-gray-400 bg-white dark:bg-dark-gray-500 px-3 pt-3 pb-8">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment"
              rows={1}
              className="w-full resize-none bg-transparent text-sm dark:text-gray-200 placeholder:text-cream-600 dark:placeholder:text-dark-gray-200 focus:outline-none leading-5"
            />
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-label="Send comment"
              className="absolute bottom-2 right-2 p-1 rounded-md transition-opacity disabled:opacity-30"
            >
              <ArrowUp
                className={`h-4 w-4 ${canSubmit ? "text-green-500 dark:text-mint-300" : "text-cream-600 dark:text-gray-500"}`}
              />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
