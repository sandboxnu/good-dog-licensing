"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { zPreProcessEmptyString } from "@good-dog/trpc/utils";
import { Button } from "@good-dog/ui/button";
import { Label } from "@good-dog/ui/label";

import RegistrationCheckbox from "../inputs/RegistrationCheckbox";
import RegistrationInput from "../inputs/RegistrationInput";
import OnboardingFormProvider from "./OnboardingFormProvider";

const Schema = z.object({
  role: z.literal("MUSICIAN"),
  firstName: zPreProcessEmptyString(z.string()),
  lastName: zPreProcessEmptyString(z.string()),
  groupName: zPreProcessEmptyString(z.string()),
  stageName: zPreProcessEmptyString(z.string().optional()),
  isSongWriter: z.boolean().optional(),
  isAscapAffiliated: z.boolean().optional(),
  isBmiAffiliated: z.boolean().optional(),
  groupMembers: z
    .array(
      z.object({
        firstName: zPreProcessEmptyString(z.string()),
        lastName: zPreProcessEmptyString(z.string()),
        stageName: zPreProcessEmptyString(z.string().optional()),
        email: zPreProcessEmptyString(z.string().email()),
        isSongWriter: z.boolean().optional(),
        isAscapAffiliated: z.boolean().optional(),
        isBmiAffiliated: z.boolean().optional(),
      }),
    )
    .optional(),
  discovery: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

const TypedRegistrationInput = RegistrationInput<FormValues>;
const TypedRegistrationCheckbox = RegistrationCheckbox<FormValues>;

export default function MusicianForm(
  user: Readonly<{
    firstName: string;
    lastName: string;
    email: string;
  }>,
) {
  return (
    <OnboardingFormProvider
      role="MUSICIAN"
      schema={Schema}
      firstName={user.firstName}
      lastName={user.lastName}
    >
      <TypedRegistrationInput
        fieldName="firstName"
        placeholder="First Name"
        type="text"
      />
      <TypedRegistrationInput
        fieldName="lastName"
        placeholder="Last Name"
        type="text"
      />
      <TypedRegistrationInput
        fieldName="stageName"
        placeholder="Stage Name"
        type="text"
      />
      <TypedRegistrationInput
        fieldName="groupName"
        placeholder="Group Name"
        type="text"
      />
      <TypedRegistrationCheckbox
        fieldName="isSongWriter"
        label="Are you a songwriter?"
      />
      <TypedRegistrationCheckbox
        fieldName="isAscapAffiliated"
        label="Are you affiliated with ASCAP?"
      />
      <TypedRegistrationCheckbox
        fieldName="isBmiAffiliated"
        label="Are you affiliated with BMI?"
      />
      <GroupMemberForm />
    </OnboardingFormProvider>
  );
}

const GroupMemberForm = () => {
  const onboardingForm = useFormContext<FormValues>();
  const groupMembersFieldArray = useFieldArray({
    control: onboardingForm.control,
    name: "groupMembers",
  });

  return (
    <div>
      <Label htmlFor="groupMembers">Group Members</Label>
      {groupMembersFieldArray.fields.map((field, index) => (
        <div key={field.id} className="mb-4">
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.firstName`}
            placeholder="First Name"
            type="text"
          />
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.lastName`}
            placeholder="Last Name"
            type="text"
          />
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.stageName`}
            placeholder="Stage Name"
            type="text"
          />
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.email`}
            placeholder="Email"
            type="text"
          />
          <TypedRegistrationCheckbox
            fieldName={`groupMembers.${index}.isSongWriter`}
            label="Are they a songwriter?"
          />
          <TypedRegistrationCheckbox
            fieldName={`groupMembers.${index}.isAscapAffiliated`}
            label="Are they affiliated with ASCAP?"
          />
          <TypedRegistrationCheckbox
            fieldName={`groupMembers.${index}.isBmiAffiliated`}
            label="Are they affiliated with BMI?"
          />
          <Button
            type="button"
            onClick={() => groupMembersFieldArray.remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() =>
          groupMembersFieldArray.append({
            firstName: "",
            lastName: "",
            email: "",
          })
        }
      >
        Add Member
      </Button>
    </div>
  );
};
