import type { HowHeardAboutUsLabel, MatchState } from "@good-dog/db";
import {
  Genre,
  MusicAffiliation,
  MusicRole,
  ProjectType,
  Role,
} from "@good-dog/db";

import type { Status } from "./status";

export function getHowHeardAboutUsLabel(value: HowHeardAboutUsLabel): string {
  switch (value) {
    case "FRIEND":
      return "Friend/Colleague";
    case "GREEN_LINE_RECORDS":
      return "Green Line Records";
    case "SOCIAL_MEDIA":
      return "Social Media";
    case "OTHER":
      return "Other";
  }
}

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
    case ProjectType.SOCIAL_MEDIA:
      return "Social Media (Youtube, Instagram, Tik Tok, Vimeo, etc.)";
    case ProjectType.PERSONAL_WEBSITE:
      return "Personal Website";
    case ProjectType.FILM_FESTIVAL:
      return "Film Festival(s)";
    case ProjectType.ACADEMIC_PROJECT:
      return "Academic Project (in-class performance)";
    case ProjectType.OTHER:
      return "Other";
  }
}

export function getStatusLabel(value: Status): string {
  switch (value) {
    case "ACTION_NEEDED":
      return "Action Needed";
    case "APPROVAL_NEEDED":
      return "Approval Needed";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "REJECTED":
      return "Rejected";
    case "SUGGESTIONS_NEEDED":
      return "Suggestions Needed";
    case "HIDDEN":
      return "Hidden";
    case "SONG_SUBMITTED":
      return "Song Submitted";
  }
}

export function getMatchStateLabel(value: MatchState): string {
  switch (value) {
    case "WAITING_FOR_MANAGER_APPROVAL":
      return "Waiting for Manager Approval";
    case "REJECTED_BY_MANAGER":
      return "Rejected by Manager";
    case "SENT_TO_MEDIA_MAKER":
      return "Waiting for Media Maker";
    case "SENT_TO_MUSICIAN":
      return "Waiting for Musician";
    case "REJECTED_BY_MEDIA_MAKER":
      return "Rejected by Media Maker";
    case "REJECTED_BY_MUSICIAN":
      return "Rejected by Musician";
    case "APPROVED_BY_MUSICIAN":
      return "Approved by Musician";
  }
}
