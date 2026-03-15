import type {
  AdmModProjectStatus,
  AdmModMatchStatus,
  AdmModSongRequestStatus,
  MediaMakerMatchStatus,
  MusicianMatchStatus,
  MediaMakerProjectStatus,
  MediaMakerSongRequestStatus,
  MusicianSongStatus,
} from "@good-dog/db";

export type Status =
  | AdmModProjectStatus
  | AdmModSongRequestStatus
  | AdmModMatchStatus
  | MediaMakerProjectStatus
  | MediaMakerSongRequestStatus
  | MediaMakerMatchStatus
  | MusicianMatchStatus
  | MusicianSongStatus;
