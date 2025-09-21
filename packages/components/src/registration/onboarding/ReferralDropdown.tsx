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

const referalDisplay: Record<ReferralSource, string> = {
  FRIEND: "Friend",
  COLLEAGUE: "Colleague",
  GREEN_LINE_RECORDS: "Green Line Records",
  SOCIAL_MEDIA: "Social Media",
  OTHER: "Other",
};

const referralOptions = Object.values(ReferralSource);

export default function ReferralDropdown() {
  const { control } = useFormContext<{
    referral?: string;
  }>();

  return (
    <div>
      <h3 className="mb-3 mt-4">How did you hear about Good Dog?</h3>
      <Controller
        name="referral"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            onValueChange={(value: string) => {
              field.onChange(value);
            }}
          >
            <SelectTrigger className="border-black bg-white">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {referralOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {referalDisplay[option]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
