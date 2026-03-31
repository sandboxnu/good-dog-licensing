import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";
import { search } from "../../../utils/search";
import SearchBar from "../../base/SearchBar";

type MusicSubmissionType = GetProcedureOutput<"allMusic">[number];

export function MusicSearchBar({
  setSearchedMusic,
}: {
  setSearchedMusic: (searchedMusic: MusicSubmissionType[]) => void;
}) {
  const [music] = trpc.allMusic.useSuspenseQuery();

  const inputHandler = (query: string) => {
    setSearchedMusic(
      music
        .filter((song) => {
          return (
            search(song.songName, query) || search(song.performerName, query)
          );
        })
        .sort((a) => {
          if (search(a.songName, query)) {
            return -1;
          } else {
            return 1;
          }
        }),
    );
  };

  return (
    <SearchBar
      onChange={inputHandler}
      placeholder="Search songs, artists, or genres"
    />
  );
}
