"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "@good-dog/trpc/client";

const schema = z.object({
  songName: z.string(),
  artist: z.string(),
  songLink: z.string(),
  genre: z.string(),
  additionalInfo: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export default function UnlicensedMusicSubmissionForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const submissionMutation = trpc.submitUnlicensedMusic.useMutation({
    onSuccess: async () => {
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
      <div className="flex flex-col items-center bg-white rounded-xl">
        <h1 className="text-5xl font-bold pt-14 px-80 m-6">
          Unlicensed Music Request Form
        </h1>
        <p className="text-xl font-bold px-28">
        Unlicensed Music Request Form is to submit music Good Dog Licensing 
        does not have in their database. By submitting this form, it will add 
        it as one of the songs to be matched for the scene you choose. 
        An admin will look into getting the licensing for this song.<br />
        <br /><sup className="text-[#F4392D]">*</sup>Indicates a required question.
        </p>
        <form
          onSubmit={handleSubmit((data) => {
            submissionMutation.mutate({
              songName: data.songName,
              artist: data.artist,
              songLink: data.songLink,
              genre: data.genre,
              additionalInfo: data.additionalInfo,
              // or could be
              // ...data,
              // but this is more explicit
            });
          })}
        >
          <div className="flex flex-col items-start">
          <label className="text-2xl font-bold pt-6 pb-3">Song Name<sup className="text-[#F4392D]">*</sup></label>
          <input className="rounded-xl bg-[#E4E4E6] h-10 w-[890px] pl-3" {...register("songName")} placeholder="Song Name"></input>
          <p>{errors.songName?.message}</p>
          <label className="text-2xl font-bold pt-12 pb-3">Artist Name<sup className="text-[#F4392D]">*</sup></label>
          <input className="rounded-xl bg-[#E4E4E6] h-10 w-[890px] pl-3" {...register("artist")} placeholder="Artist Name"></input>
          <p>{errors.artist?.message}</p>
          <label className="text-2xl font-bold pt-12 pb-3">Song Link<sup className="text-[#F4392D]">*</sup></label>
          <input className="rounded-xl bg-[#E4E4E6] h-10 w-[890px] pl-3" {...register("songLink")} placeholder="Song Link"></input>
          <p>{errors.songLink?.message}</p>
          <label className="text-2xl font-bold pt-12 pb-3">Song Genre<sup className="text-[#F4392D]">*</sup></label>
          <input className="rounded-xl bg-[#E4E4E6] h-10 w-[890px] pl-3" {...register("genre")} placeholder="Song Genre"></input>
          <p>{errors.genre?.message}</p>
          <label className="text-2xl font-bold pt-12 pb-3">Tell us anything else about the Project</label>
          <input className="rounded-xl bg-[#E4E4E6] h-10 w-[890px] pl-3" {...register("additionalInfo")} placeholder="Additional Song Info"></input>
          <p>{errors.additionalInfo?.message}</p>
          <div className="flex flex-col w-full items-center">
          <button className="text-2xl rounded-xl w-40 h-16 bg-[#098465] m-20" type="submit">Submit</button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
