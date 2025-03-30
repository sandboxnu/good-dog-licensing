"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";

import { Input } from "@good-dog/components/input";
import { Textarea } from "@good-dog/components/textarea";
import { Button } from "@good-dog/ui/button";

export default function SceneSubmission({ goNext, goBack }: Props) {
  const [selectedGenres, setSelectedGenres] = useState(["Afro", "Pop", "Love"]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const allGenres = [
    "Afro",
    "Alternative",
    "Blues",
    "Classical & Gospel",
    "Country",
    "Pop",
    "Love",
  ];

  const availableGenres = allGenres.filter(
    (genre) => !selectedGenres.includes(genre),
  );

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre));
  };

  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <main className="container mx-auto flex-1 px-4 py-12">
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

        <h2 className="mb-6 text-center text-2xl font-bold">Scene</h2>

        <div className="mb-8 text-gray-300">
          <p>
            Need help finding a song from our catalog? Submit a brief and one of
            our curators will get back to you with suitable music from our
            library.
          </p>
          <p>The more specific you are, the better we can assist!</p>
        </div>

        <div className="mb-8">
          <p className="text-red-500">* Indicates a required question.</p>
        </div>

        <form className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="scene-title" className="block font-medium">
              Scene Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="scene-title"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="scene-description" className="block font-medium">
              Scene Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="scene-description"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="music-type" className="block font-medium">
              Type of Music/Genre needed <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="music-type"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="example-artists" className="block font-medium">
              List Example Artists, Tracks, Songs, Eras, or Instrumentals{" "}
              <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="example-artists"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="anything-else" className="block font-medium">
              Tell us anything else about the Scene{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="anything-else"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              type="button"
              className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Scene
            </Button>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Button
              type="button"
              onClick={goBack}
              className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={goNext}
              className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-emerald-100 hover:text-emerald-600"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

type Props = {
  goNext: () => void;
  goBack: () => void;
};
