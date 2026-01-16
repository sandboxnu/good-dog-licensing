"use client";

import type z from "zod";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { zProjectSubmissionValues } from "@good-dog/trpc/schema";

import Button from "../../base/Button";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import Trash from "../../svg/TrashIcon";
import RHFTextInput from "../../rhf-base/RHFTextInput";

interface SongRequestsInfoProps {
  onSubmit: () => void;
  onBack: () => void;
}

type ProjectSubmissionFormFields = z.input<typeof zProjectSubmissionValues>;

export default function SongRequestsInfo({
  onSubmit,
  onBack,
}: SongRequestsInfoProps) {
  const {
    formState: { errors },
    control,
  } = useFormContext<ProjectSubmissionFormFields>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "songRequests",
  });
  return (
    <form
      className="flex w-full flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((songRequest, index) => {
        const compoundKey = `${songRequest.id}-${index}`;
        return (
          <div
            key={compoundKey}
            className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-gray-500 bg-gray-100 dark:bg-dark-gray-600 p-10 text-black"
          >
            <div className="flex flex-row items-center justify-between">
              <p className="text-xl font-semibold text-green-500 dark:text-mint-200">
                Song request #{index + 1}
              </p>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}>
                  <Trash />
                </button>
              )}
            </div>
            <RHFTextInput<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.songRequestTitle`}
              label="Title of your song request"
              placeholder=""
              id={`title-${index}`}
              errorText={
                errors.songRequests?.[index]?.songRequestTitle?.message
              }
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.description`}
              label="What will the song be used for?"
              placeholder=""
              id={`description-${index}`}
              errorText={errors.songRequests?.[index]?.description?.message}
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.feelingsConveyed`}
              label="What message(s)/feelings do you want the music to convey to the audience? "
              placeholder=""
              id={`musicType-${index}`}
              errorText={
                errors.songRequests?.[index]?.feelingsConveyed?.message
              }
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.similarSongs`}
              label="Examples of the kind of music you're looking for "
              placeholder=""
              id={`similarSongs-${index}`}
              errorText={errors.songRequests?.[index]?.similarSongs?.message}
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.additionalInfo`}
              label="Additional information (optional)"
              placeholder="Anything else we should know?"
              id={`additionalInfo-${index}`}
              errorText={errors.songRequests?.[index]?.additionalInfo?.message}
              required={false}
            />
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
          label="Song request"
          size="medium"
          variant="text"
          displayIcon="plus"
          onClick={() =>
            append({
              songRequestTitle: "",
              description: "",
              feelingsConveyed: "",
              similarSongs: "",
              additionalInfo: "",
            })
          }
        />
      </div>
    </form>
  );
}
