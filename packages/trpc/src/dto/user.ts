import { z } from "zod";

import {
  AdmModSongRequestStatus,
  MediaMakerSongRequestStatus,
  MusicAffiliation,
  MusicRole,
  ProjectType,
  Role,
} from "@good-dog/db";

/**
 * The absolute minimum needed to label a user inside another entity's
 * output (e.g. "submitted by", "project owner"). No contact info, no
 * credentials - just a name.
 */
export const zUserNameOutput = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

/**
 * {@link zUserNameOutput} plus an id, for places that link out to the
 * user's profile (e.g. admin/PNR dashboards).
 */
export const zUserSummaryOutput = zUserNameOutput.extend({
  userId: z.string(),
});

/**
 * A row in an admin-facing user directory (manage users / invite modal).
 * This is the allow-list that replaces the old `omit: { hashedPassword }`
 * pattern - anything added to the `User` model later (secret or not) is
 * dropped unless it's added here explicitly.
 */
export const zUserDirectoryRowOutput = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(Role),
  active: z.boolean(),
});

/** A signed-up P&R/admin, or a pending invite, shown in the same table. */
export const zPnrOrAdminRowOutput = z.object({
  email: z.string(),
  role: z.string(),
  status: z.enum(["ACTIVE", "PENDING"]),
});

/** The current session's user, as returned by the `user` procedure. */
export const zSessionUserOutput = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  role: z.enum(Role),
  affiliation: z.enum(MusicAffiliation).nullable(),
  ipi: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.date(),
  session: z.object({
    expiresAt: z.date(),
    refreshRequired: z.boolean(),
  }),
});

/**
 * A user's own profile page: public profile fields plus a summary of their
 * submissions. Deliberately hand-rolled (not composed from the project/music
 * DTOs) since this is the one place that needs this exact shape.
 */
export const zUserProfileOutput = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.enum(Role),
  affiliation: z.enum(MusicAffiliation).nullable(),
  ipi: z.string().nullable(),
  createdAt: z.date(),
  musicSubmissions: z.array(
    z.object({
      musicId: z.string(),
      songName: z.string(),
      songLink: z.string(),
      genres: z.array(z.string()),
      additionalInfo: z.string(),
      songLyrics: z.string(),
      contributors: z.array(
        z.object({
          contributorId: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          roles: z.array(z.enum(MusicRole)),
          affiliation: z.enum(MusicAffiliation).nullable(),
          ipi: z.string().nullable(),
          isSubmitter: z.boolean(),
          email: z.string().nullable(),
          publisher: z.string().nullable(),
          publisherIpi: z.string().nullable(),
        }),
      ),
      createdAt: z.date(),
    }),
  ),
  projectSubmissionsAsOwner: z.array(zProjectSummaryForProfile()),
  projectSubmissionsAsManager: z.array(zProjectSummaryForProfile()),
});

function zProjectSummaryForProfile() {
  return z.object({
    projectId: z.string(),
    projectTitle: z.string(),
    projectType: z.enum(ProjectType),
    deadline: z.date(),
    description: z.string(),
    additionalInfo: z.string(),
    songRequests: z.array(
      z.object({
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
      }),
    ),
    createdAt: z.date(),
  });
}
