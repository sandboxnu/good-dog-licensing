import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ReferralSource } from "@good-dog/db";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@good-dog/ui/select";

export default function ReferralDropdown() {
  const { control, register } = useFormContext<{
    source?: string;
    customSource?: string;
  }>();

  const referralOptions = Object.values(ReferralSource);

  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const handleSelectChange = (value: string) => {
    setIsOtherSelected(value === "OTHER");
  };

  return (
    <div>
      <h3 className="mb-3 mt-4">How did you hear about Good Dog?</h3>
      <Controller
        name="source"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            onValueChange={(value: string) => {
              field.onChange(value);
              handleSelectChange(value);
            }}
          >
            <SelectTrigger className="border-black bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {referralOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />

      {isOtherSelected && (
        <div className="mt-4">
          <label htmlFor="customSource" className="mb-2 block">
            Please specify:
          </label>
          <input
            id="customSource"
            {...register("customSource")}
            type="text"
            placeholder="Enter details"
            className="w-full border border-black p-2"
          />
        </div>
      )}
    </div>
  );
}
