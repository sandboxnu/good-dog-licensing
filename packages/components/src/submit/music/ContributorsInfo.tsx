"use client";

import type { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import Button from "../../base/Button";
import Trash from "../../svg/TrashIcon";
import RHFRadioGroup from "../../rhf-base/RHFRadioGroup";
import RHFMultiselectDropdown from "../../rhf-base/RFHMultiselectDropdown";
import RadioGroup from "../../base/RadioGroup";
import { trpc } from "@good-dog/trpc/client";

interface ContributorsInfoProps {
  onSubmit: () => void;
  onBack: () => void;
}

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

export default function ContributorsInfo({
  onSubmit,
  onBack,
}: ContributorsInfoProps) {
  const roleOptions = [
    { label: "Vocalist", value: "VOCALIST" },
    { label: "Instrumentalist", value: "INSTRUMENTALIST" },
    { label: "Producer", value: "PRODUCER" },
    { label: "Songwriter", value: "SONGWRITER" },
    { label: "Lyricist", value: "LYRICIST" },
  ];

  const affiliationOptions = [
    { label: "ASCAP", value: "ASCAP" },
    { label: "BMI", value: "BMI" },
    { label: "Neither", value: "NONE" },
  ];

  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<MusicSubmissionFormFields>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "contributors",
  });

  const { data: previousContributors } =
    trpc.getMusicSubmissionPrefillVals.useQuery();

  const getOtherContributorPrefillInfo = useCallback(
    (firstName: string, lastName: string) => {
      return previousContributors?.contributors.find(
        (contributor) =>
          contributor.firstName === firstName &&
          contributor.lastName === lastName,
      );
    },
    [previousContributors],
  );

  const watchedSubmitterRoles = useWatch({
    control,
    name: "submitterRoles",
  });

  const watchedSubmitterAffiliation = useWatch({
    control,
    name: "submitterAffiliation",
  });

  const watchedContributors = useWatch({
    control,
    name: "contributors",
  });

  const [isOtherContributors, setIsOtherContributors] = useState<string>(
    fields.length > 0 ? "yes" : "",
  );

  const toggleIsOtherContributors = (newState: string) => {
    if (newState === "yes") {
      replace([
        {
          firstName: "",
          lastName: "",
          roles: [],
          affiliation: undefined,
          ipi: undefined,
        },
      ]);
    } else {
      replace([]);
    }
    setIsOtherContributors(newState);
  };

  useEffect(() => {
    const shouldShowFields =
      Array.isArray(watchedSubmitterRoles) &&
      (watchedSubmitterRoles.includes("SONGWRITER") ||
        watchedSubmitterRoles.includes("LYRICIST"));
    if (!shouldShowFields) {
      setValue(
        `submitterAffiliation`,
        previousContributors?.userAffiliation ?? undefined,
      );
      setValue(`submitterIpi`, previousContributors?.userIpi ?? undefined);
    }
  }, [
    watchedSubmitterRoles,
    setValue,
    previousContributors?.userAffiliation,
    previousContributors?.userIpi,
  ]);

  useEffect(() => {
    watchedContributors.forEach((contributor, index) => {
      const roles = contributor.roles;
      const shouldShowFields =
        Array.isArray(roles) &&
        (roles.includes("SONGWRITER") || roles.includes("LYRICIST"));

      if (!shouldShowFields && (contributor.affiliation || contributor.ipi)) {
        setValue(`contributors.${index}.affiliation`, undefined);
        setValue(`contributors.${index}.ipi`, undefined);
      }
    });
  }, [watchedContributors, setValue, getOtherContributorPrefillInfo]);

  const showAffiliationFields =
    watchedSubmitterRoles.includes("SONGWRITER") ||
    watchedSubmitterRoles.includes("LYRICIST");

  const handlePrefill = (
    firstName: string,
    lastName: string,
    index: number,
  ) => {
    const prefill = getOtherContributorPrefillInfo(firstName, lastName);

    console.log("handlePrefill", prefill);

    setValue(
      `contributors.${index}.affiliation`,
      prefill?.affiliation ?? undefined,
    );
    setValue(`contributors.${index}.ipi`, prefill?.ipi ?? undefined);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="w-full text-black border-[.5px] bg-white p-10 gap-6 flex flex-col border-black rounded-2xl">
        <p className="font-semibold text-xl">Your Contributions</p>

        <RHFMultiselectDropdown<MusicSubmissionFormFields>
          rhfName={`submitterRoles`}
          label={"What was your role in the song?"}
          placeholder={"Select your role"}
          options={roleOptions}
          id={`submitterRoles`}
          errorText={errors.submitterRoles?.message}
          required={true}
        />

        {showAffiliationFields && (
          <>
            <div>
              <RHFRadioGroup<MusicSubmissionFormFields>
                rhfName={`submitterAffiliation`}
                label="Are you affiliated with ASCAP or BMI?"
                id={`submitterAffiliation`}
                errorText={errors.submitterAffiliation?.message}
                required={true}
                options={affiliationOptions}
              />
              <p
                className={`${watchedSubmitterAffiliation === "NONE" ? "block" : "hidden"} text-error`}
              >
                By selecting “Neither” you will not be financially compensated
                for those who use your music.
              </p>
            </div>
            <RHFTextInput<MusicSubmissionFormFields>
              rhfName={`submitterIpi`}
              label="What is your Interested Party Information (IPI)?"
              placeholder="Enter the IPI"
              id={`submitterIpi`}
              errorText={errors.submitterIpi?.message}
              required={
                watchedSubmitterAffiliation === "ASCAP" ||
                watchedSubmitterAffiliation === "BMI"
              }
            />
          </>
        )}
      </div>
      <div className="w-full text-black border-[.5px] bg-white p-10 gap-6 flex flex-col border-black rounded-2xl">
        <p className="font-semibold text-xl">Other contributors</p>
        <RadioGroup
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          id={""}
          label={"Did anyone else contribute to this song?"}
          value={isOtherContributors}
          onValueChange={toggleIsOtherContributors}
          required={true}
        />
      </div>
      {isOtherContributors === "yes" &&
        fields.map((contributor, index) => {
          const currentRoles = watchedContributors[index]?.roles ?? [];
          const showAffiliationFields =
            currentRoles.includes("SONGWRITER") ||
            currentRoles.includes("LYRICIST");
          const compoundKey = `${contributor.id}-${index}`;

          return (
            <div
              key={compoundKey}
              className="w-full text-black border-[.5px] bg-white p-10 gap-6 flex flex-col border-black rounded-2xl"
            >
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold text-xl">
                  Contributor #{index + 1}
                </p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)}>
                    <Trash />
                  </button>
                )}
              </div>

              <RHFTextInput<MusicSubmissionFormFields>
                rhfName={`contributors.${index}.firstName`}
                label="Contributor first name"
                placeholder="Enter first name"
                id={`firstName-${index}`}
                errorText={errors.contributors?.[index]?.firstName?.message}
                required={true}
              />

              <RHFTextInput<MusicSubmissionFormFields>
                rhfName={`contributors.${index}.lastName`}
                label="Contributor last name"
                placeholder="Enter last name"
                id={`lastName-${index}`}
                errorText={errors.contributors?.[index]?.lastName?.message}
                required={true}
              />

              <RHFMultiselectDropdown<MusicSubmissionFormFields>
                rhfName={`contributors.${index}.roles`}
                label={"What was their role in the song?"}
                placeholder={"Select their role"}
                options={roleOptions}
                id={`roles-${index}`}
                errorText={errors.contributors?.[index]?.roles?.message}
                required={true}
              />

              {showAffiliationFields && (
                <>
                  <div className="flex flex-row justify-between">
                    <div>
                      <div>
                        <RHFRadioGroup<MusicSubmissionFormFields>
                          rhfName={`contributors.${index}.affiliation`}
                          label="Are they affiliated with ASCAP or BMI?"
                          id={`affiliation-${index}`}
                          errorText={
                            errors.contributors?.[index]?.affiliation?.message
                          }
                          required={true}
                          options={affiliationOptions}
                        />
                        <p
                          className={`${watchedContributors[index]?.affiliation === "NONE" ? "block" : "hidden"} text-error`}
                        >
                          By selecting “Neither” they will not be financially
                          compensated for those who use their music.
                        </p>
                      </div>

                      <RHFTextInput<MusicSubmissionFormFields>
                        rhfName={`contributors.${index}.ipi`}
                        label="What is their Interested Party Information (IPI)?"
                        placeholder="Enter the IPI"
                        id={`ipi-${index}`}
                        errorText={errors.contributors?.[index]?.ipi?.message}
                        required={
                          watchedContributors[index]?.affiliation === "ASCAP" ||
                          watchedContributors[index]?.affiliation === "BMI"
                        }
                      />
                    </div>
                    <Button
                      size={"medium"}
                      variant={"contained"}
                      label="Pre-fill Info"
                      type="button"
                      onClick={() =>
                        handlePrefill(
                          watchedContributors[index]?.firstName ?? "",
                          watchedContributors[index]?.lastName ?? "",
                          index,
                        )
                      }
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}

      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <Button
            label="Submit"
            type="submit"
            variant="contained"
            size="medium"
          />
          <Button
            type="button"
            label="Back"
            size="medium"
            variant="text"
            onClick={() => onBack()}
          />
        </div>
        {isOtherContributors === "yes" && (
          <Button
            type="button"
            label="Contributor"
            size="medium"
            variant="text"
            displayIcon={"plus"}
            onClick={() =>
              append({
                firstName: "",
                lastName: "",
                roles: [],
                affiliation: undefined,
                ipi: undefined,
              })
            }
          />
        )}
      </div>
    </form>
  );
}
