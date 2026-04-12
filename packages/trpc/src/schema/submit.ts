import { z } from "zod";

import { Genre, MusicAffiliation, MusicRole, ProjectType } from "@good-dog/db";

export const zSongRequest = z.object({
  songRequestTitle: z.string().min(1, "This is required"),
  description: z.string().min(1, "This is required"),
  feelingsConveyed: z.string().min(1, "This is required"),
  similarSongs: z.string().min(1, "This is required"),
  additionalInfo: z.string().optional(),
});

export const zProjectSubmissionValues = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  songRequests: z.array(zSongRequest),
  deadline: z.coerce.date(),
  videoLink: z.string().optional(),
  additionalInfo: z.string().optional(),
  projectType: z.enum(ProjectType, { error: "This is required" }),
});

const zMusicContributor = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    roles: z.array(z.enum(MusicRole)).min(1, "At least one role is required"),
    affiliation: z.enum(MusicAffiliation).optional(),
    ipi: z.string().optional(),
    publisher: z.string().optional(),
    publisherIpi: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const requiresAffiliation = data.roles.some(
      (role) => role === "SONGWRITER" || role === "LYRICIST",
    );

    const requiresIpi =
      requiresAffiliation &&
      data.affiliation !== "NONE" &&
      data.affiliation !== undefined;

    if (requiresAffiliation && !data.affiliation) {
      ctx.addIssue({
        code: "custom",
        message:
          "Filling out affiliation is required for songwriters and lyricists",
        path: ["affiliation"],
      });
    }

    if (requiresIpi && !data.ipi) {
      ctx.addIssue({
        code: "custom",
        message:
          "IPI is required for songwriters and lyricists affiliated with ASCAP or BMI",
        path: ["ipi"],
      });
    }

    if (data.publisher && !data.publisherIpi) {
      ctx.addIssue({
        code: "custom",
        message: "Publisher IPI is required when a publisher is specified",
        path: ["publisherIpi"],
      });
    }

    if (data.publisherIpi && !data.publisher) {
      ctx.addIssue({
        code: "custom",
        message: "Publisher is required when a publisher IPI is specified",
        path: ["publisher"],
      });
    }
  });

export const zMusicSubmissionValues = z
  .object({
    songName: z.string().min(1, "Song name is required"),
    songLink: z.url().min(1, "Song link is required"),
    genres: z.array(z.enum(Genre)).min(1, "At least one genre is required"),
    additionalInfo: z.string().optional(),
    performerName: z.string().min(1, "Artist/Band name is required"),
    contributors: z.array(zMusicContributor),
    submitterRoles: z
      .array(z.enum(MusicRole))
      .min(1, "At least one role is required"),
    submitterAffiliation: z.enum(MusicAffiliation).optional(),
    submitterIpi: z.string().optional(),
    submitterPublisher: z.string().optional(),
    submitterPublisherIpi: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const requiresAffiliation = data.submitterRoles.some(
      (role) => role === "SONGWRITER" || role === "LYRICIST",
    );

    const requiresIpi =
      requiresAffiliation &&
      data.submitterAffiliation !== "NONE" &&
      data.submitterAffiliation !== undefined;

    if (requiresAffiliation && !data.submitterAffiliation) {
      ctx.addIssue({
        code: "custom",
        message:
          "Filling out affiliation is required for songwriters and lyricists",

        path: ["submitterAffiliation"],
      });
    }

    if (requiresIpi && !data.submitterIpi) {
      ctx.addIssue({
        code: "custom",
        message:
          "IPI is required for songwriters and lyricists affiliated with ASCAP or BMI",
        path: ["submitterIpi"],
      });
    }

    if (data.submitterPublisher && !data.submitterPublisherIpi) {
      ctx.addIssue({
        code: "custom",
        message: "Publisher IPI is required when a publisher is specified",
        path: ["submitterPublisherIpi"],
      });
    }

    if (data.submitterPublisherIpi && !data.submitterPublisher) {
      ctx.addIssue({
        code: "custom",
        message: "Publisher is required when a publisher IPI is specified",
        path: ["submitterPublisher"],
      });
    }
  });
