"use client";

import type { Dispatch, SetStateAction } from "react";
import type z from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { zDashboardControls } from "../../../../../trpc/src/schema/base";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../base/Select";
import RHFTextInput from "../../../rhf-base/RHFTextInput";

const filterOptions = [
  { label: "No filter", value: null },
  { label: "Deadline: this week", value: "Deadline: this week" },
  { label: "Assigned to me", value: "Assigned to me" },
];

type FormValues = z.input<typeof zDashboardControls>;

/**
 * Search and filter controls for the admin dashboard.
 */
export function Controls({
  setSelectedFilter,
  setSearchTerm,
}: {
  setSelectedFilter: Dispatch<SetStateAction<string | null>>;
  setSearchTerm: Dispatch<SetStateAction<string | undefined>>;
}) {
  const controlsForm = useForm<FormValues>({
    resolver: zodResolver(zDashboardControls),
  });
  const searchTerm = controlsForm.watch("searchTerm");

  useEffect(() => {
    setSearchTerm(searchTerm);
  }, [searchTerm, setSearchTerm]);

  return (
    <FormProvider {...controlsForm}>
      <div className="pr-[40px]">
        <RHFTextInput<FormValues>
          rhfName={"searchTerm"}
          label={""}
          placeholder={"Search..."}
          id="searchTerm"
          errorText={controlsForm.formState.errors.searchTerm?.message}
        />
      </div>
      <Select
        onValueChange={(value: string | null) => setSelectedFilter(value)}
      >
        <SelectTrigger className="w-[296px] justify-between">
          <SelectValue
            placeholder={
              <div className="flex items-center gap-[4px] text-gray-400">
                <FilterIcon />
                Filter
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent
          align="end"
          side="bottom"
          className="flex w-[296px] flex-col gap-2 bg-white px-2 py-4"
        >
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormProvider>
  );
}
