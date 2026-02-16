import type z from "zod";

import RHFTextInput from "../rhf-base/RHFTextInput";
import Search from "../svg/Search";
import type { zSearchTermValues } from "../../../trpc/src/schema/base";

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
