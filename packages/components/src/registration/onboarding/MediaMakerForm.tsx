"use client";

import { z } from "zod";

import { zPreProcessEmptyString } from "@good-dog/trpc/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@good-dog/ui/select";

import RegistrationInput from "../inputs/RegistrationInput";
import OnboardingFormProvider from "./OnboardingFormProvider";

const Schema = z.object({
  role: z.literal("MEDIA_MAKER"),
  firstName: zPreProcessEmptyString(z.string()),
  lastName: zPreProcessEmptyString(z.string()),
  discovery: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

const TypedRegistrationInput = RegistrationInput<FormValues>;

export default function MediaMakerForm(
  props: Readonly<{
    firstName: string;
    lastName: string;
  }>,
) {
  return (
    <OnboardingFormProvider
      role="MEDIA_MAKER"
      schema={Schema}
      firstName={props.firstName}
      lastName={props.lastName}
    >
      <p>
        A Media Maker is a Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Mauris pharetra lacus sit amet turpis suscipit, eget convallis
        elit. Etiam ac tortor ac lectus scelerisque mollis.{" "}
      </p>
      <div className="flex flex-row space-x-3">
        <div className="flex flex-1 flex-col">
          <h3 className="mb-3 mt-4 text-good-dog-violet">
            First Name<span className="text-good-dog-error">*</span>
          </h3>
          <TypedRegistrationInput
            fieldName="firstName"
            placeholder="Jane"
            type="text"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="mb-3 mt-4 text-good-dog-violet">
            Last Name<span className="text-good-dog-error">*</span>
          </h3>
          <TypedRegistrationInput
            fieldName="lastName"
            placeholder="Doe"
            type="text"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-3 mt-4">How did you hear about Good Dog?</h3>
        <Select>
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
      </div>
      
    </OnboardingFormProvider>
  );
}
