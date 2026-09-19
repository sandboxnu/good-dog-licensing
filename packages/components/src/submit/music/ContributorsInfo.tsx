"use client";

import type z from "zod";
import { useCallback, useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import type { GetProcedureOutput } from "@good-dog/trpc/types";
import type { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { MusicAffiliation, MusicRole } from "@good-dog/db";
import { trpc } from "@good-dog/trpc/client";

import {
  getMusicAffiliationLabel,
  getMusicRoleLabel,
} from "../../../utils/enumLabelMapper";
import Button from "../../base/Button";
import RadioGroup from "../../base/RadioGroup";
import RHFMultiselectDropdown from "../../rhf-base/RFHMultiselectDropdown";
import RHFRadioGroup from "../../rhf-base/RHFRadioGroup";
import RHFTextInput from "../../rhf-base/RHFTextInput";

interface ContributorsInfoProps {
  onSubmit: () => void;
  onBack: () => void;
}

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

type ContributorPrefill = GetProcedureOutput<"getMusicSubmissionPrefillVals">;

export default function ContributorsInfo({
  onSubmit,
  onBack,
}: ContributorsInfoProps) {
  const [previousContributors] =
    trpc.getMusicSubmissionPrefillVals.useSuspenseQuery();

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ContributorsFields
        prefill={previousContributors}
        submitterSectionTitle="Your Contributions"
        actions={
          <>
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
          </>
        }
      />
    </form>
  );
}

interface ContributorsFieldsProps {
  /**
   * The signed-in user's own past contributor details, used to auto-fill their
   * section and to power the "Pre-fill Info" button. Null on the staff edit
   * page, where those details belong to the musician who submitted the song
   * rather than to whoever is editing it.
   */
  prefill: ContributorPrefill | null;
  submitterSectionTitle: string;
  submitterQuestions?: {
    roles: string;
    affiliation: string;
    ipi: string;
  };
  /** Form-level buttons, rendered next to "Add contributor". */
  actions: React.ReactNode;
}

/**
 * The contributor cards on their own, shared by the submission flow and the
 * staff-only edit page.
 */
export function ContributorsFields({
  prefill,
  submitterSectionTitle,
  submitterQuestions = {
    roles: "What was your role in the song?",
    affiliation: "Are you affiliated with ASCAP or BMI?",
    ipi: "What is your Interested Party Information (IPI)?",
  },
  actions,
}: ContributorsFieldsProps) {
  const roleOptions = Object.values(MusicRole).map((role) => ({
    label: getMusicRoleLabel(role),
    value: role,
  }));

  const affiliationOptions = Object.values(MusicAffiliation).map(
    (affiliation) => ({
      label: getMusicAffiliationLabel(affiliation),
      value: affiliation,
    }),
  );

  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<MusicSubmissionFormFields>();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "contributors",
  });

  const getOtherContributorPrefillInfo = useCallback(
    (firstName: string, lastName: string) => {
      return prefill?.contributors.find(
        (contributor) =>
          contributor.firstName === firstName &&
          contributor.lastName === lastName,
      );
    },
    [prefill],
  );

  const watchedSubmitterRoles = useWatch({
    control,
    name: "submitterRoles",
  });

  const watchedSubmitterAffiliation = useWatch({
    control,
    name: "submitterAffiliation",
  });

  const watchedSubmitterPublisher = useWatch({
    control,
    name: "submitterPublisher",
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
          email: undefined,
          roles: [],
          affiliation: undefined,
          ipi: undefined,
          publisher: undefined,
          publisherIpi: undefined,
        },
      ]);
    } else {
      replace([]);
    }
    setIsOtherContributors(newState);
  };

  useEffect(() => {
    // Only the submitter's own form falls back to their saved profile values.
    if (!prefill) return;

    const shouldShowFields =
      Array.isArray(watchedSubmitterRoles) &&
      (watchedSubmitterRoles.includes("SONGWRITER") ||
        watchedSubmitterRoles.includes("LYRICIST"));
    if (!shouldShowFields) {
      setValue(`submitterAffiliation`, prefill.userAffiliation ?? undefined);
      setValue(`submitterIpi`, prefill.userIpi ?? undefined);
      setValue(`submitterPublisher`, prefill.userPublisher ?? undefined);
      setValue(`submitterPublisherIpi`, prefill.userPublisherIpi ?? undefined);
    }
  }, [watchedSubmitterRoles, setValue, prefill]);

  useEffect(() => {
    watchedContributors.forEach((contributor, index) => {
      const roles = contributor.roles;
      const shouldShowFields =
        Array.isArray(roles) &&
        (roles.includes("SONGWRITER") || roles.includes("LYRICIST"));

      if (
        !shouldShowFields &&
        (contributor.affiliation ||
          contributor.ipi ||
          contributor.publisher ||
          contributor.publisherIpi)
      ) {
        setValue(`contributors.${index}.affiliation`, undefined);
        setValue(`contributors.${index}.ipi`, undefined);
        setValue(`contributors.${index}.publisher`, undefined);
        setValue(`contributors.${index}.publisherIpi`, undefined);
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
    const match = getOtherContributorPrefillInfo(firstName, lastName);

    setValue(`contributors.${index}.email`, match?.email ?? undefined);
    setValue(
      `contributors.${index}.affiliation`,
      match?.affiliation ?? undefined,
    );
    setValue(`contributors.${index}.ipi`, match?.ipi ?? undefined);
    setValue(`contributors.${index}.publisher`, match?.publisher ?? undefined);
    setValue(
      `contributors.${index}.publisherIpi`,
      match?.publisherIpi ?? undefined,
    );
  };

  return (
    <>
      <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 bg-white p-10 text-black dark:bg-dark-gray-600">
        <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
          {submitterSectionTitle}
        </p>

        <RHFMultiselectDropdown<MusicSubmissionFormFields>
          rhfName={`submitterRoles`}
          label={submitterQuestions.roles}
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
                label={submitterQuestions.affiliation}
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
              label={submitterQuestions.ipi}
              placeholder="Enter the IPI"
              id={`submitterIpi`}
              errorText={errors.submitterIpi?.message}
              required={
                watchedSubmitterAffiliation === "ASCAP" ||
                watchedSubmitterAffiliation === "BMI"
              }
            />
            <RHFTextInput<MusicSubmissionFormFields>
              rhfName={`submitterPublisher`}
              label="Who is your publisher?"
              placeholder="Enter your publisher"
              id={`submitterPublisher`}
              errorText={errors.submitterPublisher?.message}
              required={false}
            />
            <RHFTextInput<MusicSubmissionFormFields>
              rhfName={`submitterPublisherIpi`}
              label="What is your publisher's IPI?"
              placeholder="Enter the publisher IPI"
              id={`submitterPublisherIpi`}
              errorText={errors.submitterPublisherIpi?.message}
              required={!!watchedSubmitterPublisher}
            />
          </>
        )}
      </div>
      <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 bg-white p-10 text-black dark:bg-dark-gray-600">
        <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
          Other contributors
        </p>
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
              className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-black border-gray-500 bg-gray-100 bg-white p-10 text-black dark:bg-dark-gray-600"
            >
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl font-semibold text-dark-gray-500 dark:text-mint-300">
                  Contributor #{index + 1}
                </p>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)}>
                    <Trash className="text-error" />
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

              <RHFTextInput<MusicSubmissionFormFields>
                rhfName={`contributors.${index}.email`}
                label="Contributor email"
                placeholder="Enter email"
                id={`email-${index}`}
                errorText={errors.contributors?.[index]?.email?.message}
                required={false}
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
                      <RHFTextInput<MusicSubmissionFormFields>
                        rhfName={`contributors.${index}.publisher`}
                        label="Who is their publisher?"
                        placeholder="Enter their publisher"
                        id={`publisher-${index}`}
                        errorText={
                          errors.contributors?.[index]?.publisher?.message
                        }
                        required={false}
                      />
                      <RHFTextInput<MusicSubmissionFormFields>
                        rhfName={`contributors.${index}.publisherIpi`}
                        label="What is their publisher's IPI?"
                        placeholder="Enter the publisher IPI"
                        id={`publisherIpi-${index}`}
                        errorText={
                          errors.contributors?.[index]?.publisherIpi?.message
                        }
                        required={!!watchedContributors[index]?.publisher}
                      />
                    </div>
                    {prefill && (
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
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-4">{actions}</div>
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
                email: undefined,
                roles: [],
                affiliation: undefined,
                ipi: undefined,
                publisher: undefined,
                publisherIpi: undefined,
              })
            }
          />
        )}
      </div>
    </>
  );
}
