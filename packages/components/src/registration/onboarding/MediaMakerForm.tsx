"use client";

import { z } from "zod";

import { zPreProcessEmptyString } from "@good-dog/trpc/utils";

import RegistrationInput from "../inputs/RegistrationInput";
import DiscoveryDropdown from "./DiscoveryDropdown";
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
        elit. Etiam ac tortor ac lectus scelerisque mollis.
      </p>
      <div className="flex flex-row space-x-3">
        <TypedRegistrationInput
          fieldName="firstName"
          placeholder="Jane"
          type="text"
          label="First Name"
        />
        <TypedRegistrationInput
          fieldName="lastName"
          placeholder="Doe"
          type="text"
          label="Last Name"
        />
      </div>
      <DiscoveryDropdown />
    </OnboardingFormProvider>
  );
}
