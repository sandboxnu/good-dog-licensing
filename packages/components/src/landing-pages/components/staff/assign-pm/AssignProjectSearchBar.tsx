import type { GetProcedureOutput } from "@good-dog/trpc/types";
import { trpc } from "@good-dog/trpc/client";

import { search } from "../../../../../utils/search";
import SearchBar from "../../../../base/SearchBar";

type UserType = GetProcedureOutput<"adminAndModeratorUsers">["users"][number];

export function AssignProjectSearchBar({
  setSearchedUsers,
}: {
  setSearchedUsers: (searchedUsers: UserType[]) => void;
}) {
  const [usersQuery] = trpc.adminAndModeratorUsers.useSuspenseQuery();

  const inputHandler = (query: string) => {
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

  return <SearchBar onChange={inputHandler} placeholder="Search users" />;
}
