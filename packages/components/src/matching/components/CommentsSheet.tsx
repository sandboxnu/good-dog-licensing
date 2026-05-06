"use client";

import { useState, useRef, useEffect } from "react";
import { X, ArrowUp } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@good-dog/ui/sheet";
import { trpc } from "@good-dog/trpc/client";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import ProfileIcon from "../../svg/ProfileIcon";

type Comment = GetProcedureOutput<"getSongRequestById">["comments"][number];

// Detect URLs in text and render them as clickable links
// FIX: Shares code with song-request/commentsSheet
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

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 20;
    const maxHeight = lineHeight * 3 + 24;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [text]);

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
        <div className="flex flex-col gap-1 px-6 pt-6 pb-4 border-b border-cream-300 dark:border-dark-gray-600">
          <div className="flex flex-row justify-between items-center">
            <p className="text-lg font-medium dark:text-gray-200">Comments</p>
            <SheetClose className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4 dark:text-gray-200" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <p className="text-sm text-cream-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Scrollable comment list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5"
        >
          {comments.length === 0 ? (
            <p className="text-sm text-cream-600 dark:text-gray-400 italic">
              No comments yet.
            </p>
          ) : (
            comments.map((c) => <CommentItem key={c.commentId} comment={c} />)
          )}
        </div>

        {/* Input area */}
        <div className="px-6 pb-6 pt-2">
          <div className="relative rounded-lg border border-cream-400 dark:border-dark-gray-400 bg-white dark:bg-dark-gray-500">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment"
              rows={1}
              className="block w-full resize-none bg-white dark:bg-dark-gray-500 text-sm dark:text-gray-200 placeholder:text-cream-600 dark:placeholder:text-dark-gray-200 focus:outline-none leading-5 px-3 pt-3 pb-8"
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
