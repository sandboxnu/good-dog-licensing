import type { Prisma } from "@good-dog/db";

/**
 * Minimal project fields for list views (e.g. dashboard, admin query results).
 */
export const publicProjectSummarySelect = {
  projectId: true,
  projectTitle: true,
  description: true,
  createdAt: true,
  deadline: true,
  projectType: true,
  admModStatus: true,
  mediaMakerStatus: true,
  projectOwnerId: true,
  projectManagerId: true,
} satisfies Prisma.ProjectSubmissionSelect;

export type PublicProjectSummary = Prisma.ProjectSubmissionGetPayload<{
  select: typeof publicProjectSummarySelect;
}>;

/**
 * Full project detail — all public fields including content fields.
 * Use for individual project views and when song requests are nested.
 */
export const publicProjectFullSelect = {
  projectId: true,
  projectTitle: true,
  description: true,
  additionalInfo: true,
  videoLink: true,
  createdAt: true,
  deadline: true,
  projectType: true,
  admModStatus: true,
  mediaMakerStatus: true,
  projectOwnerId: true,
  projectManagerId: true,
} satisfies Prisma.ProjectSubmissionSelect;

export type PublicProjectFull = Prisma.ProjectSubmissionGetPayload<{
  select: typeof publicProjectFullSelect;
}>;
