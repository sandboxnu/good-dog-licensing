"use client";

import { useFormContext } from "react-hook-form";
import type z from "zod";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import RHFTextArea from "../../rhf-base/RHFTextArea";
import Button from "../../base/Button";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import RHFMultiselectDropdown from "../../rhf-base/RFHMultiselectDropdown";

interface InitialMusicInfoProps {
  onNext: () => void;
}

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

export default function InitialMusicInfo({
  onNext,
}: InitialMusicInfoProps) {
  const {
    formState: { errors },
    reset,
    getValues,
  } = useFormContext<MusicSubmissionFormFields>();

  const handleClear = () => {
    const currentContributors = getValues("contributors");

    reset({
      songName: "",
      songLink: "",
      genre: [],
      additionalInfo: "",
      performerName: "",
      contributors: currentContributors,
      submitterRoles: [],
      submitterAffiliation: undefined,
      submitterIpi: "",
    });
  };
  return (
    <form
      className="flex flex-col gap-8 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="w-full text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl">
        <p className="font-semibold text-xl">Song information</p>
        <div className="flex flex-row gap-6">
          <RHFTextInput<MusicSubmissionFormFields>
            rhfName="songName"
            label="Song title"
            placeholder="Enter song title"
            id="songName"
            errorText={errors.songName?.message}
            required={true}
          />
          <RHFTextInput<MusicSubmissionFormFields>
            rhfName="performerName"
            label="Artist/Band name"
            placeholder="Enter artist or band name"
            id="performerName"
            errorText={errors.performerName?.message}
            required={true}
          />
        </div>
        <RHFMultiselectDropdown<MusicSubmissionFormFields>
          rhfName="genre"
          label="Song genre"
          placeholder="Select song genres"
          id="genre"
          errorText={errors.genre?.message}
          options={[]}
          required={true}
        />
        <RHFTextInput<MusicSubmissionFormFields>
          rhfName="songLink"
          label="Song link"
          placeholder="Enter link to song"
          id="songLink"
          errorText={errors.songLink?.message}
          required={true}
        />
        <RHFTextArea<MusicSubmissionFormFields>
          rhfName="additionalInfo"
          label="Additional information (optional)"
          placeholder="Anything else we should know?"
          id="additionalInfo"
          errorText={errors.additionalInfo?.message}
          required={false}
        />
      </div>
      <div className="flex flex-row gap-4">
        <Button label="Next" type="submit" variant="contained" size="medium" />
        <Button
          type="button"
          label="Clear form"
          size="medium"
          variant="text"
          onClick={handleClear}
        />
      </div>
    </form>
  );
}
