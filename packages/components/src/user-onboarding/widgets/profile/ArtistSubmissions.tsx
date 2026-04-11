import { MusicAffiliation } from "@good-dog/db";
import type { GetProcedureOutput } from "@good-dog/trpc/types";
import ProfileSection from "./ProfileSection";

type UserByIdOutput = GetProcedureOutput<"userById">;

export default function ArtistSubmissions({ user }: { user: UserByIdOutput }) {
  if (user.role === "MUSICIAN") {
    return (
      <ProfileSection header="Song submissions">
        {user.musicSubmissions.map((song) => (
          // Accordion per song: song name, genres, link, songwriters, description, etc.
        ))}
      </ProfileSection>
    );
  }

  return (
    <ProfileSection header="Project submissions">
      {[user.projectSubmissionsAsOwner, user.projectSubmissionsAsManager].map((project) => (
      ))}
    </ProfileSection>
  );
}
