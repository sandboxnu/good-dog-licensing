import type z from "zod";

import type { zSearchTermValues } from "@good-dog/trpc/schema";

import RHFTextInput from "../rhf-base/RHFTextInput";
import Search from "../svg/Search";

type SearchTermFormFields = z.input<typeof zSearchTermValues>;

export default function SearchBar() {
  return (
    <div className="w-[214px]">
      <RHFTextInput<SearchTermFormFields>
        rhfName="searchTerm"
        label=""
        placeholder=""
        id="searchTerm"
        icon={<Search />}
      />
    </div>
  );
}
