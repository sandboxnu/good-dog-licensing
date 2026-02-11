import { zDashboardControls } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../base/Select";
import { FilterIcon } from "lucide-react";

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
  setSearchTerm
}: {
  setSelectedFilter: Function;
  setSearchTerm: Function;
}) {
  const controlsForm = useForm<FormValues>({
    resolver: zodResolver(zDashboardControls),
  });
  setSearchTerm(controlsForm.watch("searchTerm"));

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
      <Select       onValueChange={(value: string | null) => setSelectedFilter(value)}
      >
        <SelectTrigger className="w-[296px] justify-between">
          <SelectValue
            placeholder={
              <div className="flex items-center text-gray-400 gap-[4px]">
                <FilterIcon />
                Filter
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent
          align="end"
          side="bottom"
          className="w-[296px] gap-2 py-4 px-2 bg-white flex flex-col gap-2"
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
