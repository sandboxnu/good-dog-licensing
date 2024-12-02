import { Controller, useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@good-dog/ui/select";

export default function DiscoveryDropdown() {
  const { control } = useFormContext<{
    discovery?: string;
  }>();

  return (
    <div>
      <h3 className="mb-3 mt-4">How did you hear about Good Dog?</h3>
      <Controller
        name="discovery"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            <SelectTrigger className="border-black bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="social media">Social media</SelectItem>
                <SelectItem value="green line records">
                  Green Line Records
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
