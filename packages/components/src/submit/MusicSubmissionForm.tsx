"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zMusicSubmissionValues } from "@good-dog/trpc/schema";
import { Button } from "@good-dog/ui/button";
import { Form } from "@good-dog/ui/form";

import { GoodDogInput, GoodDogMultiSelect, GoodDogSingleSelect } from "../form";

type MusicSubmissionFormFields = z.input<typeof zMusicSubmissionValues>;

const Select = GoodDogSingleSelect<MusicSubmissionFormFields>;
const Input = GoodDogInput<MusicSubmissionFormFields>;
const MultiSelect = GoodDogMultiSelect<MusicSubmissionFormFields>;

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

export function MusicSubmissionForm() {
  const [musicianGroups] = trpc.usersMusicianGroups.useSuspenseQuery();

  const submitMusicForm = useForm<MusicSubmissionFormFields>({
    resolver: zodResolver(zMusicSubmissionValues),
  });
  const submitMusicProcedureMutation = trpc.submitMusic.useMutation({
    // TODO: handle success and error
    onSuccess: () => {
      window.alert("Success!");
      submitMusicForm.reset();
    },
  });

  const handleSubmit = submitMusicForm.handleSubmit((values) => {
    submitMusicProcedureMutation.mutate(values);
  });

  const currentGroup =
    musicianGroups.find(
      (g) => g.groupId === submitMusicForm.watch("groupId"),
    ) ?? musicianGroups[0];

  const songWriters =
    currentGroup?.groupMembers
      .filter((member) => member.isSongWriter)
      .map((sw) => ({
        value: sw.email,
        label: `${sw.firstName} ${sw.lastName}`,
      })) ?? [];

  return (
    <Form {...submitMusicForm}>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto flex-1 px-4 py-12"
      >
        <main className="mx-auto w-full flex-1 bg-black px-4 py-12 text-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-center text-4xl font-bold">
              Song Submission
            </h1>

            <div className="mb-8 text-center">
              <p className="mb-2 text-gray-300">You are submitting for</p>
              <Select
                name="groupId"
                options={musicianGroups.map((group) => ({
                  value: group.groupId,
                  label: group.name,
                }))}
                placeholder="Select a band"
                label={currentGroup?.name ?? "Unknown Band"}
              />
            </div>

            <div className="mb-8 text-gray-300">
              <p>
                We are so thrilled that you're interested! Good Dog Licensing is
                Northeastern's student-run music-licensing platform for
                independent musicians. We aspire to connect independent artists
                and independent content creators. 100% of any money earned from
                a synch deal will go to you! Good Dog will be no-risk and
                non-exclusive. You will keep all your rights, you can say “no”
                to any placements and you will be able to withdraw your music at
                any time!!
              </p>
            </div>

            <div className="space-y-12">
              <Input
                name="songName"
                label="Song Name"
                placeholder="Your song's title"
              />
              <MultiSelect
                name="songWriterEmails"
                options={songWriters}
                placeholder="Select multiple options"
                label="Song Writers"
              />
              <Input
                name="songLink"
                label="Link to Song"
                placeholder="Link to your song (Soundcloud, Spotify, etc.)"
              />
              <MultiSelect
                name="genre"
                options={genres}
                placeholder="Select multiple options"
                label="Song Genre"
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-[#098465] hover:bg-[#098465]"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </main>
      </form>
    </Form>
  );
}
