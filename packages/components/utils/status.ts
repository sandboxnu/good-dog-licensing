import type {
  AdmModMatchStatus,
  AdmModProjectStatus,
  AdmModSongRequestStatus,
  MediaMakerMatchStatus,
  MediaMakerProjectStatus,
  MediaMakerSongRequestStatus,
  MusicianMatchStatus,
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
