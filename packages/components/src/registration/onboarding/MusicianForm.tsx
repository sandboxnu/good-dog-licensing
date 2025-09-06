"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";

import { ReferralSource } from "@good-dog/db";
import { zPreProcessEmptyString } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";

import RegistrationCheckbox from "../inputs/RegistrationCheckbox";
import RegistrationInput from "../inputs/RegistrationInput";
import OnboardingFormProvider from "./OnboardingFormProvider";
import ReferralDropdown from "./ReferralDropdown";

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
  referral: z
    .object({
      source: z.nativeEnum(ReferralSource),
      customSource: zPreProcessEmptyString(z.string().optional()),
    })
    .optional(),
});

type FormValues = z.input<typeof Schema>;

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
      email={user.email}
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
          autocomplete="given-name"
        />

        <TypedRegistrationInput
          fieldName="lastName"
          placeholder="Doe"
          type="text"
          label="Last Name"
          autocomplete="family-name"
        />
      </div>
      <TypedRegistrationInput
        fieldName="stageName"
        type="text"
        placeholder="Your stage name"
        label="Stage Name"
      />
      <TypedRegistrationInput
        fieldName="groupName"
        placeholder="Your group Name"
        type="text"
        label="Group Name"
      />
      <div className="mb-3 mt-4 space-y-2 text-2xl">
        <TypedRegistrationCheckbox
          fieldName="isSongWriter"
          label="I am a songwriter"
        />
        <TypedRegistrationCheckbox
          fieldName="isAscapAffiliated"
          label="I am affiliated with ASCAP"
        />
        <TypedRegistrationCheckbox
          fieldName="isBmiAffiliated"
          label="I am affiliated with BMI"
        />
      </div>
      <hr className="mx-auto my-6 w-full border-good-dog-violet" />
      <GroupMemberForm />
      <ReferralDropdown />
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
                fieldName={`groupMembers.${index}.firstName`}
                placeholder="Jane"
                type="text"
                label="First Name"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex flex-row">
                <h3 className="mb-3 mt-4 text-good-dog-violet">
                  Last Name<span className="text-good-dog-error">*</span>
                </h3>
                <Button
                  className="ml-auto"
                  type="button"
                  onClick={() => groupMembersFieldArray.remove(index)}
                >
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.2098 8.28983C16.1169 8.19611 16.0063 8.12171 15.8844 8.07094C15.7626 8.02017 15.6318 7.99404 15.4998 7.99404C15.3678 7.99404 15.2371 8.02017 15.1153 8.07094C14.9934 8.12171 14.8828 8.19611 14.7898 8.28983L12.4998 10.5898L10.2098 8.28983C10.0215 8.10153 9.76614 7.99574 9.49984 7.99574C9.23353 7.99574 8.97814 8.10153 8.78983 8.28983C8.60153 8.47814 8.49574 8.73353 8.49574 8.99984C8.49574 9.26614 8.60153 9.52153 8.78983 9.70984L11.0898 11.9998L8.78983 14.2898C8.69611 14.3828 8.62171 14.4934 8.57094 14.6153C8.52017 14.7371 8.49404 14.8678 8.49404 14.9998C8.49404 15.1318 8.52017 15.2626 8.57094 15.3844C8.62171 15.5063 8.69611 15.6169 8.78983 15.7098C8.8828 15.8036 8.9934 15.878 9.11526 15.9287C9.23712 15.9795 9.36782 16.0056 9.49984 16.0056C9.63185 16.0056 9.76255 15.9795 9.88441 15.9287C10.0063 15.878 10.1169 15.8036 10.2098 15.7098L12.4998 13.4098L14.7898 15.7098C14.8828 15.8036 14.9934 15.878 15.1153 15.9287C15.2371 15.9795 15.3678 16.0056 15.4998 16.0056C15.6318 16.0056 15.7626 15.9795 15.8844 15.9287C16.0063 15.878 16.1169 15.8036 16.2098 15.7098C16.3036 15.6169 16.378 15.5063 16.4287 15.3844C16.4795 15.2626 16.5056 15.1318 16.5056 14.9998C16.5056 14.8678 16.4795 14.7371 16.4287 14.6153C16.378 14.4934 16.3036 14.3828 16.2098 14.2898L13.9098 11.9998L16.2098 9.70984C16.3036 9.61687 16.378 9.50627 16.4287 9.38441C16.4795 9.26255 16.5056 9.13185 16.5056 8.99984C16.5056 8.86782 16.4795 8.73712 16.4287 8.61526C16.378 8.4934 16.3036 8.3828 16.2098 8.28983ZM19.5698 4.92984C18.6474 3.97473 17.5439 3.21291 16.3239 2.68882C15.1038 2.16473 13.7916 1.88887 12.4638 1.87733C11.1361 1.86579 9.81926 2.11881 8.59029 2.62162C7.36133 3.12443 6.24481 3.86696 5.30589 4.80589C4.36696 5.74481 3.62443 6.86133 3.12162 8.09029C2.61881 9.31926 2.36579 10.6361 2.37733 11.9638C2.38887 13.2916 2.66473 14.6038 3.18882 15.8239C3.71291 17.0439 4.47473 18.1474 5.42984 19.0698C6.3523 20.0249 7.45575 20.7868 8.67579 21.3109C9.89583 21.8349 11.208 22.1108 12.5358 22.1223C13.8636 22.1339 15.1804 21.8809 16.4094 21.3781C17.6383 20.8752 18.7549 20.1327 19.6938 19.1938C20.6327 18.2549 21.3752 17.1383 21.8781 15.9094C22.3809 14.6804 22.6339 13.3636 22.6223 12.0358C22.6108 10.708 22.3349 9.39583 21.8109 8.17579C21.2868 6.95575 20.5249 5.8523 19.5698 4.92984ZM18.1598 17.6598C16.8519 18.9692 15.1304 19.7847 13.2886 19.9671C11.4469 20.1496 9.59884 19.6879 8.05936 18.6606C6.51987 17.6333 5.38419 16.104 4.84581 14.3333C4.30742 12.5626 4.39964 10.66 5.10675 8.94962C5.81386 7.23926 7.09211 5.82698 8.72373 4.9534C10.3553 4.07981 12.2394 3.79897 14.0548 4.15871C15.8703 4.51845 17.5049 5.49653 18.6801 6.9263C19.8553 8.35607 20.4984 10.1491 20.4998 11.9998C20.5034 13.0511 20.2984 14.0927 19.8968 15.0642C19.4951 16.0358 18.9047 16.918 18.1598 17.6598Z"
                      fill="white"
                    />
                  </svg>
                </Button>
              </div>

              <TypedRegistrationInput
                fieldName={`groupMembers.${index}.lastName`}
                placeholder="Doe"
                type="text"
                label="Last Name"
              />
            </div>
          </div>
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.email`}
            placeholder="Email"
            type="text"
            label="Email"
          />
          <TypedRegistrationInput
            fieldName={`groupMembers.${index}.stageName`}
            placeholder="Stage Name"
            type="text"
            label="Stage Name"
          />
          <div className="mb-3 mt-4 space-y-2 text-2xl">
            <TypedRegistrationCheckbox
              fieldName={`groupMembers.${index}.isSongWriter`}
              label="This person is a songwriter"
            />
            <TypedRegistrationCheckbox
              fieldName={`groupMembers.${index}.isAscapAffiliated`}
              label="This person is affiliated with ASCAP"
            />
            <TypedRegistrationCheckbox
              fieldName={`groupMembers.${index}.isBmiAffiliated`}
              label="This person is affiliated with BMI"
            />
          </div>
        </div>
      ))}
      <div className="flex flex-row">
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7363 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 20C10.4178 20 8.87104 19.5308 7.55544 18.6518C6.23985 17.7727 5.21447 16.5233 4.60897 15.0615C4.00347 13.5997 3.84504 11.9911 4.15372 10.4393C4.4624 8.88743 5.22433 7.46197 6.34315 6.34315C7.46197 5.22433 8.88743 4.4624 10.4393 4.15372C11.9911 3.84504 13.5997 4.00346 15.0615 4.60896C16.5233 5.21447 17.7727 6.23984 18.6518 7.55544C19.5308 8.87103 20 10.4177 20 12C20 14.1217 19.1572 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20ZM16 11H13V8C13 7.73478 12.8946 7.48043 12.7071 7.29289C12.5196 7.10536 12.2652 7 12 7C11.7348 7 11.4804 7.10536 11.2929 7.29289C11.1054 7.48043 11 7.73478 11 8V11H8C7.73479 11 7.48043 11.1054 7.2929 11.2929C7.10536 11.4804 7 11.7348 7 12C7 12.2652 7.10536 12.5196 7.2929 12.7071C7.48043 12.8946 7.73479 13 8 13H11V16C11 16.2652 11.1054 16.5196 11.2929 16.7071C11.4804 16.8946 11.7348 17 12 17C12.2652 17 12.5196 16.8946 12.7071 16.7071C12.8946 16.5196 13 16.2652 13 16V13H16C16.2652 13 16.5196 12.8946 16.7071 12.7071C16.8946 12.5196 17 12.2652 17 12C17 11.7348 16.8946 11.4804 16.7071 11.2929C16.5196 11.1054 16.2652 11 16 11Z"
              fill="white"
            />
          </svg>
        </Button>
        <p className="mx-1">Add a Group Member</p>
      </div>
    </div>
  );
};
