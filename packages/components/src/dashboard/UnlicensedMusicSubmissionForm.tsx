"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

import MultiSelectDropdown from "../MultiSelectDropDown";

const schema = z.object({
  songName: z.string(),
  artist: z.string(),
  songLink: z.string(),
  genre: z.string(),
  additionalInfo: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

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

export default function UnlicensedMusicSubmissionForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const submissionMutation = trpc.submitUnlicensedMusic.useMutation({
    onSuccess: () => {
      // TODO, alert the user that they have successfully submitted unlicensed music
      router.push("/");
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
          onSubmit={handleSubmit((data) => {
            submissionMutation.mutate(data);
          })}
        >
          <div className="flex flex-col items-start">
            <label className="pb-3 pt-6 text-2xl font-bold">
              Song Name<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...register("songName")}
              placeholder="Song Name"
            ></input>
            <p>{errors.songName?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Artist Name<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...register("artist")}
              placeholder="Artist Name"
            ></input>
            <p>{errors.artist?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Song Link<sup className="text-[#F4392D]">*</sup>
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...register("songLink")}
              placeholder="Song Link"
            ></input>
            <p>{errors.songLink?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Song Genre<sup className="text-[#F4392D]">*</sup>
            </label>
            <MultiSelectDropdown
              name="genre"
              control={control}
              options={genres}
              placeholder="Select Multiple Genres"
            />
            <p>{errors.genre?.message}</p>
            <label className="pb-3 pt-12 text-2xl font-bold">
              Tell us anything else about the Project
            </label>
            <input
              className="h-10 w-[890px] rounded-xl bg-[#E4E4E6] pl-3"
              {...register("additionalInfo")}
              placeholder="Additional Song Info"
            ></input>
            <p>{errors.additionalInfo?.message}</p>
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
