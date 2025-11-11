import { Genre, MusicAffiliation, MusicRole } from "@good-dog/db";

export function getGenreLabel(value: Genre): string {
  switch (value) {
    case Genre.ROCK:
      return "Rock";
    case Genre.FOLK:
      return "Folk";
    case Genre.POP:
      return "Pop";
    case Genre.HIP_HOP:
      return "Hip_Hop";
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
