import type { GetProcedureOutput } from "@good-dog/trpc/types";
import NavLogo from "../../svg/NavLogo";
import { trpc } from "@good-dog/trpc/client";
import { search } from "../../../utils/search";

type MusicSubmissionType = GetProcedureOutput<"music">[number];

export function MusicSearchBar({
  setSearchedMusic,
}: {
  setSearchedMusic: (searchedMusic: MusicSubmissionType[]) => void;
}) {
  const [music] = trpc.music.useSuspenseQuery();

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
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
    <div className="flex flex-row px-2 gap-1 items-center w-full border-[0.5px] rounded-lg focus-within:ring-2 focus-within:ring-green-400">
      <NavLogo size={16} />
      <input
        className="flex-1 outline-none"
        type="text"
        onChange={inputHandler}
        placeholder="Type to find a song, artist or genre"
      />
    </div>
  );
}
