"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSearchTermValues } from "@good-dog/trpc/schema";
import type { z } from "zod";
import SearchBar from "../../base/SearchBar";
import RHFSingleDropdown from "../../base/SingleDropdown";
import Button from "../../base/Button";

type SearchTermFormFields = z.input<typeof zSearchTermValues>;

export default function SearchFilterForm() {
  const methods = useForm<SearchTermFormFields>({
    resolver: zodResolver(zSearchTermValues),
    defaultValues: {
      searchTerm: "",
      filter: "none",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: SearchTermFormFields) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-row gap-[16px] items-center"
      >
        <SearchBar />
        <RHFSingleDropdown
          label=""
          rhfName="filter"
          placeholder="Filter: None"
          id="filter"
          options={[
            { label: "Filter: None", value: "none" },
            { label: "A to Z", value: "alpha" },
            { label: "Newest", value: "newest" },
          ]}
        />
      </form>
    </FormProvider>
  );
}
