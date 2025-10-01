import { z } from "zod";

import { MusicAffiliation, MusicRole } from ".prisma/client";

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
  deadline: z.coerce.date(),
  videoLink: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const zMusicContributor = z.object({
  name: z.string(),
  roles: z.array(z.enum(MusicRole)),
  affiliation: z.enum(MusicAffiliation),
  ipi: z.string().optional(),
});

export const zMusicSubmissionValues = z.object({
  songName: z.string(),
  songLink: z.url(),
  genre: z.array(z.string()),
  additionalInfo: z.string().optional(),
  performerName: z.string(),
  contributors: z.array(zMusicContributor),
  submitterRoles: z.array(z.enum(MusicRole)),
  submitterAffiliation: z.enum(MusicAffiliation),
  submitterIpi: z.string().optional(),
});
