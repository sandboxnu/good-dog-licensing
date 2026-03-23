import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  // not sure if this is doing anything --check (problems because it also omits from backend which is bad and is causing weird errors. need only for frontend?)
  // omit: {
  //   user: {
  //     hashedPassword: true,
  //   },
  //   session: {
  //     sessionId: true,
  //   },
  //   emailVerificationCode: {
  //     code: true,
  //   },
  //   passwordResetReq: {
  //     passwordResetId: true,
  //   },
  //   moderatorInvite: {
  //     moderatorInviteId: true,
  //   },
  // },
});

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
