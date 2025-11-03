"use client";

import type { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import Button from "../../base/Button";
import Trash from "../../svg/TrashIcon";
import RHFRadioGroup from "../../rhf-base/RHFRadioGroup";
import RHFMultiselectDropdown from "../../rhf-base/RFHMultiselectDropdown";

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
    { label: "None", value: "" },
  ];

  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<MusicSubmissionFormFields>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contributors",
  });

  const watchedContributors = useWatch({
    control,
    name: "contributors",
  });

  useEffect(() => {
    watchedContributors?.forEach((contributor, index) => {
      const roles = contributor?.roles || [];
      const shouldShowFields =
        roles.includes("SONGWRITER") || roles.includes("LYRICIST");

      if (!shouldShowFields && (contributor?.affiliation || contributor?.ipi)) {
        setValue(`contributors.${index}.affiliation`, undefined);
        setValue(`contributors.${index}.ipi`, undefined);
      }
    });
  }, [watchedContributors, setValue]);

  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((contributor, index) => {
        const currentRoles = watchedContributors?.[index]?.roles || [];
        const showAffiliationFields =
          currentRoles.includes("SONGWRITER") ||
          currentRoles.includes("LYRICIST");
        const compoundKey = `${contributor.id}-${index}`;

        return (
          <div
            key={compoundKey}
            className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl"
          >
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold text-xl">Contributor #{index + 1}</p>
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
                <RHFRadioGroup<MusicSubmissionFormFields>
                  rhfName={`contributors.${index}.affiliation`}
                  label="Are they affiliated with ASCAP or BMI?"
                  id={`affiliation-${index}`}
                  errorText={errors.contributors?.[index]?.affiliation?.message}
                  required={true}
                  options={affiliationOptions}
                />

                <RHFTextInput<MusicSubmissionFormFields>
                  rhfName={`contributors.${index}.ipi`}
                  label="What is their Interested Party Information (IPI)?"
                  placeholder="Enter the IPI"
                  id={`ipi-${index}`}
                  errorText={errors.contributors?.[index]?.ipi?.message}
                  required={true}
                />
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
        <Button
          type="button"
          label="Contributor"
          size="medium"
          variant="text"
          displayIcon={true}
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
      </div>
    </form>
  );
}
