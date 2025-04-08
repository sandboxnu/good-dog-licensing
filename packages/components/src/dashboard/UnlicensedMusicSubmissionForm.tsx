"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

import { GoodDogMultiSelect } from "../form";

const schema = z.object({
  songName: z.string().min(1, "Song name is required"),
  artist: z.string().min(1, "Artist name is required"),
  songLink: z.string().url(),
  genre: z.string().min(1, "Genre is required"),
  additionalInfo: z.string().optional(),
});

type FormFields = z.input<typeof schema>;

const genres = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "hip-hop", label: "Hip-Hop/Rap" },
  { value: "r&b", label: "R&B" },
  { value: "edm", label: "Electronic/Dance (EDM)" },
  { value: "country", label: "Country" },
  { value: "jazz", label: "Jazz" },
  { value: "classical", label: "Classical" },
  { value: "reggae", label: "Reggae" },
  { value: "blues", label: "Blues" },
  { value: "latin", label: "Latin" },
  { value: "funk", label: "Funk" },
  { value: "soul", label: "Soul" },
  { value: "metal", label: "Metal" },
  { value: "folk", label: "Folk" },
];

interface UnlicensedMusicSubmissionFormProps {
  handleSubmission?: (musicId: string) => Promise<void>;
}

export default function UnlicensedMusicSubmissionForm({
  handleSubmission,
}: UnlicensedMusicSubmissionFormProps) {
  const router = useRouter();

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const submissionMutation = trpc.submitUnlicensedMusic.useMutation({
    onSuccess: async (data) => {
      if (handleSubmission) {
        await handleSubmission(data.id);
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      // TODO
      console.error(err);
    },
  });

  return (
    <div className="bg-[#DEE0E2] p-14">
      <div className="flex flex-col items-center rounded-xl bg-white">
        <h1 className="m-6 px-80 pt-14 text-5xl font-bold">
          Unlicensed Music Request Form
        </h1>
        <p className="px-28 text-xl font-bold">
          Unlicensed Music Request Form is to submit music Good Dog Licensing
          does not have in their database. By submitting this form, it will add
          it as one of the songs to be matched for the scene you choose. An
          admin will look into getting the licensing for this song.
          <br />
          <br />
          <sup className="text-[#F4392D]">*</sup>Indicates a required question.
        </p>
        <form
          onSubmit={form.handleSubmit((data) => {
            submissionMutation.mutate(data);
          })}
        >
          <div className="flex flex-col items-start">
            <label className="pb-3 pt-6 text-2xl font-bold">
              Song Name<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...form.register("songName")}
              placeholder="Song Name"
            ></input>
            <p>{form.formState.errors.songName?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Artist Name<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...form.register("artist")}
              placeholder="Artist Name"
            ></input>
            <p>{form.formState.errors.artist?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Song Link<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...form.register("songLink")}
              placeholder="Song Link"
            ></input>
            <p>{form.formState.errors.songLink?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Song Genre<sup className="text-[#F4392D]">*</sup>
            </label>
            <FormProvider {...form}>
              <GoodDogMultiSelect
                name="genre"
                options={genres}
                placeholder="Select Multiple Genres"
                label="Song Genre"
                uniqueKey="unlicensed-music-submission-genre"
              />
            </FormProvider>
            <p>{form.formState.errors.genre?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Additional Information
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...form.register("additionalInfo")}
              placeholder="Additional Song Info"
            ></input>
            <p>{form.formState.errors.additionalInfo?.message}</p>
            <div className="flex w-full flex-col items-center">
              <button
                className="m-20 h-16 w-40 rounded-xl bg-[#098465] text-2xl"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
