import { z } from "zod";

import {
  AdmModMatchStatus,
  MatchState,
  MediaMakerMatchStatus,
  MusicianMatchStatus,
} from "@good-dog/db";

import { zContractOutput } from "./contract";
import { zMusicSubmissionOutput } from "./music";
import { zProjectSubmissionOutput, zSongRequestOutput } from "./project";
import { zUserNameOutput } from "./user";

/** Match's own columns, no relations. */
export const zMatchOutput = z.object({
  matchId: z.string(),
  songRequestId: z.string(),
  musicId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  matcherUserId: z.string(),
  matchState: z.enum(MatchState),
  admModStatus: z.enum(AdmModMatchStatus),
  mediaMakerStatus: z.enum(MediaMakerMatchStatus),
  musicianStatus: z.enum(MusicianMatchStatus),
});

/** Match after a state transition - used by `updateMatchState`. */
export const zMatchWithSongRequestAndMusicOutput = zMatchOutput.extend({
  songRequest: zSongRequestOutput,
  musicSubmission: zMusicSubmissionOutput,
});

/** Match as shown to a media maker reviewing suggested music. */
export const zMatchWithMusicAndSubmitterOutput = zMatchOutput.extend({
  musicSubmission: zMusicSubmissionOutput.extend({
    submitter: zUserNameOutput,
  }),
});

/**
 * A match viewed from the "which project/song request is this music tied
 * to" angle - used inside a music submission's detail view.
 */
export const zMatchWithProjectContextOutput = zMatchOutput.extend({
  songRequest: zSongRequestOutput.extend({
    projectSubmission: zProjectSubmissionOutput.extend({
      projectOwner: zUserNameOutput,
    }),
  }),
  contract: zContractOutput.nullable(),
});

/**
 * A match viewed from the "which music was suggested for this song
 * request" angle - used inside a song request's detail view.
 */
export const zMatchWithMusicContextOutput = zMatchOutput.extend({
  musicSubmission: zMusicSubmissionOutput.extend({
    contributors: z.array(zUserNameOutput),
    submitter: zUserNameOutput,
  }),
  contract: zContractOutput.nullable(),
});
