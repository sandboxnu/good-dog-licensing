import { z } from "zod";

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

export const zMusicSubmissionValues = z.object({
  songName: z.string(),
  songLink: z.url(),
  genre: z.array(z.string()),
  additionalInfo: z.string().optional(),
  performerName: z.string(),
});
