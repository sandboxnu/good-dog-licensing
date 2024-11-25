"use client";

import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { zPreProcessEmptyString } from "@good-dog/trpc/utils";
import { Button } from "@good-dog/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@good-dog/ui/select";

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
        <h3 className="mb-3 mt-4 text-good-dog-violet">
          Stage Name<span className="text-good-dog-error">*</span>
        </h3>
        <TypedRegistrationInput fieldName="stageName" type="text" />
      </div>

      <TypedRegistrationInput
        fieldName="groupName"
        placeholder="Group Name"
        type="text"
      />
      <div className="mb-3 mt-4 space-y-2 text-2xl">
        <TypedRegistrationCheckbox
          fieldName="isSongWriter"
          label="This person is a songwriter"
        />
        <TypedRegistrationCheckbox
          fieldName="isAscapAffiliated"
          label="This person is affiliated with ASCAP"
        />
        <TypedRegistrationCheckbox
          fieldName="isBmiAffiliated"
          label="This person is affiliated with BMI"
        />
      </div>
      <hr className="mx-auto w-60 border-good-dog-violet" />
      <GroupMemberForm />
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

const GroupMemberForm = () => {
  const onboardingForm = useFormContext<FormValues>();
  const groupMembersFieldArray = useFieldArray({
    control: onboardingForm.control,
    name: "groupMembers",
  });

  return (
    <div>
      {groupMembersFieldArray.fields.map((field, index) => (
        <div key={field.id} className="mb-4">
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
              <div className="flex flex-row">
                <h3 className="mb-3 mt-4 text-good-dog-violet">
                  Last Name<span className="text-good-dog-error">*</span>
                </h3>
                <Button
                  style={{ all: "unset", marginLeft: "auto" }}
                  type="button"
                  onClick={() => groupMembersFieldArray.remove(index)}
                >
                  <Image
                    alt="Remove member"
                    src="/icons/clear-x.svg"
                    width={24}
                    height={24}
                    className="hover:cursor-pointer"
                  />
                </Button>
              </div>

              <TypedRegistrationInput
                fieldName="lastName"
                placeholder="Doe"
                type="text"
              />
            </div>
          </div>
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.email`}
            placeholder="Email"
            type="text"
          />

          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.stageName`}
            placeholder="Stage Name"
            type="text"
          />
          <div className="mb-3 mt-4 space-y-2 text-2xl">
            <TypedRegistrationCheckbox
              fieldName="isSongWriter"
              label="This person is a songwriter"
            />
            <TypedRegistrationCheckbox
              fieldName="isAscapAffiliated"
              label="This person is affiliated with ASCAP"
            />
            <TypedRegistrationCheckbox
              fieldName="isBmiAffiliated"
              label="This person is affiliated with BMI"
            />
          </div>
        </div>
      ))}
      <div className="float-right flex flex-row">
        <p className="mx-1">Add a Member</p>
        <Button
          style={{ all: "unset" }}
          type="button"
          onClick={() =>
            groupMembersFieldArray.append({
              firstName: "",
              lastName: "",
              email: "",
            })
          }
        >
          <Image
            alt="Add member"
            src="/icons/plus-circle.svg"
            width={24}
            height={24}
            className="hover:cursor-pointer"
          ></Image>
        </Button>
      </div>
    </div>
  );
};
