import { z } from "zod";

export const zProjectSubmissionValues = z.object({
  projectTitle: z.string(),
  description: z.string(),
  scenes: z.array(
    z.object({
      sceneTitle: z.string(),
      description: z.string(),
      musicType: z.string(),
      similarSongs: z.string().optional(),
      additionalInfo: z.string().optional(),
    }),
  ),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  videoLink: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const zMusicSubmissionValues = z.object({
  groupId: z.string(),
  songName: z.string(),
  songLink: z.string().url(),
  genre: z.array(z.string()),
  songwriters: z.array(
    z.object({
      email: z.string(),
    }),
  ),
  additionalInfo: z.string().optional(),
});
