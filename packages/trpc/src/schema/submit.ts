import { z } from "zod";

import { Genre, MusicAffiliation, MusicRole } from "@good-dog/db";

export const zProjectSubmissionValues = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  songRequests: z.array(
    z.object({
      oneLineSummary: z.string().min(1, "Song request summary is required"),
      description: z.string().min(1, "Song request description is required"),
      musicType: z.string().min(1, "Song request music type is required"),
      similarSongs: z.string().optional(),
      additionalInfo: z.string().optional(),
    }),
  ),
  deadline: z.coerce.date(),
  videoLink: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const zMusicContributor = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    roles: z.array(z.enum(MusicRole)).min(1, "At least one role is required"),
    affiliation: z.enum(MusicAffiliation).optional(),
    ipi: z.string().optional(),
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
  });
