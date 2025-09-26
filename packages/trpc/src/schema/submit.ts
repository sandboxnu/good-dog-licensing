import { z } from "zod";

export const zProjectSubmissionValues = z.object({
  projectTitle: z.string(),
  description: z.string(),
  songRequests: z.array(
    z.object({
      description: z.string(),
      musicType: z.string(),
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
