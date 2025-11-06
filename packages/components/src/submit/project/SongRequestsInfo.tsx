"use client";

import type { zProjectSubmissionValues } from "@good-dog/trpc/schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import Button from "../../base/Button";
import Trash from "../../svg/TrashIcon";

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
      className="flex flex-col gap-8 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {fields.map((songRequest, index) => {
        return (
          <div
            key={`${songRequest.id}`}
            className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl"
          >
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold text-xl">Song request #{index + 1}</p>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)}>
                  <Trash />
                </button>
              )}
            </div>
            <RHFTextInput<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.oneLineSummary`}
              label="What is the song for?"
              placeholder="Write a brief summary for the song request"
              id={`oneLineSummary-${index}`}
              errorText={errors.songRequests?.[index]?.oneLineSummary?.message}
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.description`}
              label="Why do you need a song?"
              placeholder="What will the song be used for?"
              id={`description-${index}`}
              errorText={errors.songRequests?.[index]?.description?.message}
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.musicType`}
              label="Type of song/genre needed"
              placeholder="What is the project about?"
              id={`musicType-${index}`}
              errorText={errors.songRequests?.[index]?.musicType?.message}
              required={true}
            />
            <RHFTextArea<ProjectSubmissionFormFields>
              rhfName={`songRequests.${index}.similarSongs`}
              label="List Example Artists, Tracks, Songs, or Instrumentals"
              placeholder="List similar songs you’re looking for"
              id={`similarSongs-${index}`}
              errorText={errors.songRequests?.[index]?.similarSongs?.message}
              required={false}
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
              oneLineSummary: "",
              description: "",
              musicType: "",
              similarSongs: "",
              additionalInfo: "",
            })
          }
        />
      </div>
    </form>
  );
}
