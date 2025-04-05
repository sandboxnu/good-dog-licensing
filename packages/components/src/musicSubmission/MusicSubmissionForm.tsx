"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import MultiSelectDropdown from "@good-dog/components/MultiSelectDropDown";
import { Textarea } from "@good-dog/components/textarea";
import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";
import { Checkbox } from "@good-dog/ui/checkbox";
import { Input } from "@good-dog/ui/input";

const schema = z.object({
  groupId: z.string(),
  songName: z.string(),
  songLink: z.string().url(),
  genre: z.string(),
  songwriters: z.array(
    z.object({
      email: z.string(),
    }),
  ),
  additionalInfo: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export default function MusicSubmissionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const trpcUtils = trpc.useUtils();
  const submitMusicProcedureMutation = trpc.submitMusic.useMutation({
    onSuccess: async () => {
      // TODO, alert the user they have successfully created an account
      router.push("/");
    },
    onError: (err) => {
      // TODO, alert the user there was an error creating their account
      console.error(err);
    },
  });

  const genres = [
    { value: "pop", label: "Pop" },
    { value: "rock", label: "Rock" },
    { value: "hip-hip", label: "Hip-Hop/Rap" },
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

  return (
    <main className="mx-auto w-full flex-1 bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-center text-4xl font-bold">Submission</h1>

        <div className="mb-8 text-center">
          <p className="mb-2 text-gray-300">
            You are submitting for [Band Name]
          </p>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white hover:bg-zinc-700 hover:text-white"
          >
            Change
          </Button>
        </div>

        <div className="mb-8 text-gray-300">
          <p>
            We are so thrilled that you're interested! Good Dog Licensing is
            Northeastern's student-run music-licensing platform for independent
            musicians. We aspire to connect independent artists and independent
            content creators. 100% of any money earned from a synch deal will go
            to you! Good Dog will be no-risk and non-exclusive. You will keep
            all your rights, you can say “no” to any placements and you will be
            able to withdraw your music at any time!!
          </p>
        </div>

        <div className="mb-8">
          <p className="text-red-500">* Indicates a required question.</p>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            submitMusicProcedureMutation.mutate({
              ...data,
            });
          })}
          className="space-y-8"
        >
          <div className="space-y-1">
            <label htmlFor="project-name" className="block font-medium">
              Song Name <span className="text-red-500">*</span>
            </label>

            <Input
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
              {...register("songName")}
              placeholder="Your Answer"
            ></Input>

            <p>{errors.songName?.message}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="block font-medium">
              Link To Song <span className="text-red-500">*</span>
            </label>

            <Input
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
              {...register("songLink")}
              placeholder="Your Answer"
            ></Input>
            <p>{errors.songLink?.message}</p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium">
              Songwriters<sup className="text-[#F4392D]">*</sup>
            </label>

            <div className="flex items-center">
              <input type="checkbox" className="accent-zinc-500" />
              <p className="pl-4">Member 1</p>
            </div>

            <div className="flex items-stretch">
              <input type="checkbox" className="accent-zinc-500" />
              <p className="pl-4">Member 2</p>
            </div>

            <p>{errors.genre?.message}</p>
          </div>

          <div className="space-y-2"></div>
          <label className="block font-medium">
            Song Genre<sup className="text-[#F4392D]">*</sup>
          </label>
          <MultiSelectDropdown
            name="genre"
            control={control}
            options={genres}
            placeholder="Select multiple options"
          />
          <p>{errors.genre?.message}</p>
        </form>
      </div>
    </main>
  );
}

type Props = {
  goBack: () => void;
  onSubmit: () => void;
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
};
