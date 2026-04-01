import type { Prisma } from "@good-dog/db";

/**
 * All public comment fields safe for the frontend.
 */
export const publicCommentSelect = {
  commentId: true,
  commentText: true,
  userId: true,
  songRequestId: true,
  createdAt: true,
} satisfies Prisma.CommentsSelect;

export type PublicComment = Prisma.CommentsGetPayload<{
  select: typeof publicCommentSelect;
}>;
