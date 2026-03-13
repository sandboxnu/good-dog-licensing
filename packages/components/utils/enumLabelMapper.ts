import {
  AdmModProjectStatus,
  AdmModMatchStatus,
  AdmModSongRequestStatus,
  MediaMakerMatchStatus,
  MusicianMatchStatus,
  MediaMakerProjectStatus,
  MediaMakerSongRequestStatus,
  Genre,
  MusicAffiliation,
  MusicRole,
  ProjectType,
  Role,
} from "@good-dog/db";

export function getGenreLabel(value: Genre): string {
  switch (value) {
    case Genre.ROCK:
      return "Rock";
    case Genre.FOLK:
      return "Folk";
    case Genre.POP:
      return "Pop";
    case Genre.HIP_HOP:
      return "Hip Hop";
    case Genre.JAZZ:
      return "Jazz";
    case Genre.CLASSICAL:
      return "Classical";
    case Genre.ELECTRONIC:
      return "Electronic";
    case Genre.COUNTRY:
      return "Country";
    case Genre.REGGAE:
      return "Reggae";
    case Genre.BLUES:
      return "Blues";
    case Genre.OTHER:
      return "Other";
  }
}

export function getMusicRoleLabel(value: MusicRole): string {
  switch (value) {
    case MusicRole.VOCALIST:
      return "Vocalist";
    case MusicRole.INSTRUMENTALIST:
      return "Instrumentalist";
    case MusicRole.PRODUCER:
      return "Producer";
    case MusicRole.SONGWRITER:
      return "Songwriter";
    case MusicRole.LYRICIST:
      return "Lyricist";
  }
}

export function getRoleLabel(value: Role): string {
  switch (value) {
    case Role.MUSICIAN:
      return "Musician";
    case Role.MEDIA_MAKER:
      return "Media Maker";
    case Role.ADMIN:
      return "Admin";
    case Role.MODERATOR:
      return "P&R";
  }
}

export function getMusicAffiliationLabel(value: MusicAffiliation): string {
  switch (value) {
    case MusicAffiliation.ASCAP:
      return "ASCAP";
    case MusicAffiliation.BMI:
      return "BMI";
    case MusicAffiliation.NONE:
      return "Neither";
  }
}

export function getProjectTypeLabel(value: ProjectType): string {
  switch (value) {
    case ProjectType.MOTION_PICTURE:
      return "Motion Picture/Audio Visual Work";
    case ProjectType.SOCIAL_MEDIA_REEL:
      return "Social Media Reel";
    case ProjectType.VIDEO_GAME:
      return "Video Game";
  }
}

export function getAdmModProjectStatusLabel(
  value: AdmModProjectStatus,
): string {
  switch (value) {
    case AdmModProjectStatus.ACTION_NEEDED:
      return "Action Needed";
    case AdmModProjectStatus.IN_PROGRESS:
      return "In Progress";
    case AdmModProjectStatus.COMPLETED:
      return "Completed";
  }
}

export function getAdmModMatchStatusLabel(value: AdmModMatchStatus): string {
  switch (value) {
    case AdmModMatchStatus.APPROVAL_NEEDED:
      return "Approval Needed";
    case AdmModMatchStatus.IN_PROGRESS:
      return "In Progress";
    case AdmModMatchStatus.REJECTED:
      return "Rejected";
    case AdmModMatchStatus.COMPLETED:
      return "Completed";
  }
}

export function getAdmModSongRequestStatusLabel(
  value: AdmModSongRequestStatus,
): string {
  switch (value) {
    case AdmModSongRequestStatus.COMPLETED:
      return "Completed";
    case AdmModSongRequestStatus.APPROVAL_NEEDED:
      return "Approval Needed";
    case AdmModSongRequestStatus.IN_PROGRESS:
      return "In Progress";
    case AdmModSongRequestStatus.SUGGESTIONS_NEEDED:
      return "Suggestions Needed";
  }
}

export function getMediaMakerProjectStatusLabel(
  value: MediaMakerProjectStatus,
): string {
  switch (value) {
    case MediaMakerProjectStatus.ACTION_NEEDED:
      return "Action Needed";
    case MediaMakerProjectStatus.IN_PROGRESS:
      return "In Progress";
    case MediaMakerProjectStatus.COMPLETED:
      return "Completed";
  }
}

export function getMediaMakerSongRequestStatusLabel(
  value: MediaMakerSongRequestStatus,
): string {
  switch (value) {
    case MediaMakerSongRequestStatus.COMPLETED:
      return "Completed";
    case MediaMakerSongRequestStatus.APPROVAL_NEEDED:
      return "Approval Needed";
    case MediaMakerSongRequestStatus.IN_PROGRESS:
      return "In Progress";
  }
}

export function getMediaMakerMatchStatusLabel(
  value: MediaMakerMatchStatus,
): string {
  switch (value) {
    case MediaMakerMatchStatus.HIDDEN:
      return "Hidden";
    case MediaMakerMatchStatus.APPROVAL_NEEDED:
      return "Approval Needed";
    case MediaMakerMatchStatus.IN_PROGRESS:
      return "In Progress";
    case MediaMakerMatchStatus.COMPLETED:
      return "Completed";
    case MediaMakerMatchStatus.REJECTED:
      return "Rejected";
  }
}

export function getMusicianMatchStatusLabel(
  value: MusicianMatchStatus,
): string {
  switch (value) {
    case MusicianMatchStatus.HIDDEN:
      return "Hidden";
    case MusicianMatchStatus.APPROVAL_NEEDED:
      return "Approval Needed";
    case MusicianMatchStatus.REJECTED:
      return "Rejected";
    case MusicianMatchStatus.COMPLETED:
      return "Completed";
  }
}
