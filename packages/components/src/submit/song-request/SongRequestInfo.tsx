"use client";

import type z from "zod";
import { useFormContext } from "react-hook-form";

import type { zSongRequest } from "@good-dog/trpc/schema";

import Button from "../../base/Button";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import RHFTextInput from "../../rhf-base/RHFTextInput";

interface SongRequestsInfoProps {
  onSubmit: () => void;
  onBack: () => void;
}

type SongRequestSubmissionFormFields = z.input<typeof zSongRequest>;

export default function SongRequestInfo({
  onSubmit,
  onBack,
}: SongRequestsInfoProps) {
  const {
    formState: { errors },
  } = useFormContext<SongRequestSubmissionFormFields>();
  return (
    <form
      className="flex w-full flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex w-full flex-col gap-6 rounded-2xl border-[.5px] border-black bg-white p-10 text-black">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xl font-semibold">New song request</p>
        </div>
        <RHFTextInput<SongRequestSubmissionFormFields>
          rhfName={`songRequestTitle`}
          label="Title of your song request"
          placeholder=""
          id={`title`}
          errorText={errors.songRequestTitle?.message}
          required={true}
        />
        <RHFTextArea<SongRequestSubmissionFormFields>
          rhfName={`description`}
          label="What will the song be used for?"
          placeholder=""
          id={`description`}
          errorText={errors.description?.message}
          required={true}
        />
        <RHFTextArea<SongRequestSubmissionFormFields>
          rhfName={`feelingsConveyed`}
          label="What message(s)/feelings do you want the music to convey to the audience? "
          placeholder=""
          id={`musicType`}
          errorText={errors.feelingsConveyed?.message}
          required={true}
        />
        <RHFTextArea<SongRequestSubmissionFormFields>
          rhfName={`similarSongs`}
          label="Examples of the kind of music you’re looking for "
          placeholder=""
          id={`similarSongs`}
          errorText={errors.similarSongs?.message}
          required={true}
        />
        <RHFTextArea<SongRequestSubmissionFormFields>
          rhfName={`additionalInfo`}
          label="Additional information (optional)"
          placeholder="Anything else we should know?"
          id={`additionalInfo`}
          errorText={errors.additionalInfo?.message}
          required={false}
        />
      </div>
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
    </form>
  );
}
