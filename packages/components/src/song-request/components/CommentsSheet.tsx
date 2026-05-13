"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Sheet, SheetContent } from "@good-dog/ui/sheet";
import { trpc } from "@good-dog/trpc/client";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import CommentItem from "../../shared/comments/CommentItem";

type Comment = GetProcedureOutput<"getSongRequestById">["comments"][number];

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
              <CommentItem key={c.commentId} comment={c} />
            </div>
          ))}
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
