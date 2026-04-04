import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Re-export prisma types and enums here if needed for other packages
export {
  Role,
  MatchState,
  MusicAffiliation,
  MusicRole,
  Genre,
  ProjectType,
  AdmModMatchStatus,
  AdmModProjectStatus,
  AdmModSongRequestStatus,
  MediaMakerMatchStatus,
  MediaMakerProjectStatus,
  MediaMakerSongRequestStatus,
  MusicianMatchStatus,
  MusicianSongStatus,
} from "@prisma/client";
