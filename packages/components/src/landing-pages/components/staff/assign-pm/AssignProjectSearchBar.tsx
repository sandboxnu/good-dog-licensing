import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";
import { search } from "../../../../../utils/search";
import NavLogo from "../../../../svg/NavLogo";

type UserType = GetProcedureOutput<"adminAndModeratorUsers">["users"][number];

export function AssignProjectSearchBar({
  setSearchedUsers,
}: {
  setSearchedUsers: (searchedUsers: UserType[]) => void;
}) {
  const [usersQuery] = trpc.adminAndModeratorUsers.useSuspenseQuery();

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchedUsers(
      usersQuery.users
        .filter((user) => {
          return (
            search(user.firstName, query) ||
            search(user.lastName, query) ||
            search(user.email, query)
          );
        })
        .sort((a) => {
          if (search(a.firstName, query)) {
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
