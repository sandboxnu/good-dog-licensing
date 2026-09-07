import { z } from "zod";

import {
  AdmModProjectStatus,
  AdmModSongRequestStatus,
  MediaMakerProjectStatus,
  MediaMakerSongRequestStatus,
  ProjectType,
} from "@good-dog/db";

import { zUserNameOutput } from "./user";

/**
 * SongRequest's own columns. No relations, nothing sensitive on this model,
 * so this is safe to reuse wherever a full song request record is returned.
 */
export const zSongRequestOutput = z.object({
  songRequestId: z.string(),
  songRequestTitle: z.string(),
  description: z.string(),
  feelingsConveyed: z.string(),
  similarSongs: z.string(),
  additionalInfo: z.string(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  admModStatus: z.enum(AdmModSongRequestStatus),
  mediaMakerStatus: z.enum(MediaMakerSongRequestStatus),
});

/**
 * ProjectSubmission's own columns, no relations. Nothing sensitive lives on
 * this model - the risk is always in the `projectOwner`/`projectManager`
 * relations, which callers must attach explicitly (see
 * {@link zUserNameOutput}/{@link zUserSummaryOutput}) rather than including
 * the full `User` record.
 */
export const zProjectSubmissionOutput = z.object({
  projectId: z.string(),
  projectOwnerId: z.string(),
  projectManagerId: z.string().nullable(),
  projectTitle: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deadline: z.date(),
  videoLink: z.string(),
  additionalInfo: z.string(),
  projectType: z.enum(ProjectType),
  admModStatus: z.enum(AdmModProjectStatus),
  mediaMakerStatus: z.enum(MediaMakerProjectStatus),
});

/** Row in the admin/PNR "all projects" list - project + song requests + owner's name. */
export const zProjectWithSongRequestsRowOutput =
  zProjectSubmissionOutput.extend({
    songRequests: z.array(zSongRequestOutput),
    projectOwner: zUserNameOutput,
    createdAtDateString: z.string(),
  });

/** Row in a media maker's own "my projects" list. */
export const zMediaMakerProjectRowOutput = z.object({
  projectId: z.string(),
  projectTitle: z.string(),
  createdAt: z.date(),
  description: z.string(),
  mediaMakerStatus: z.enum(MediaMakerProjectStatus),
});
