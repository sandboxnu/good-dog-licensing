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
            <label htmlFor="song-genre" className="block font-medium">
              Song Genre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className="flex cursor-pointer flex-wrap gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-2 pr-10 text-white"
                onClick={toggleDropdown}
              >
                {selectedGenres.map((genre) => (
                  <div
                    key={genre}
                    className="flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{genre}</span>
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="text-emerald-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={toggleDropdown}
              >
                <ChevronDown
                  className={`h-5 w-5 text-white transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
                  {selectedGenres.map((genre) => (
                    <div
                      key={`selected-${genre}`}
                      className="flex cursor-pointer items-center px-4 py-2 text-white"
                      onMouseEnter={() => setHoveredGenre(genre)}
                      onMouseLeave={() => setHoveredGenre(null)}
                    >
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span>{genre}</span>
                    </div>
                  ))}

                  {availableGenres.map((genre) => (
                    <div
                      key={`available-${genre}`}
                      className={`flex cursor-pointer items-center px-4 py-2 text-white ${
                        hoveredGenre === genre ? "bg-emerald-700" : ""
                      }`}
                      onClick={() => addGenre(genre)}
                      onMouseEnter={() => setHoveredGenre(genre)}
                      onMouseLeave={() => setHoveredGenre(null)}
                    >
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700"></div>
                      <span>{genre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
            <label htmlFor="similar-songs" className="block font-medium">
              Link Similar Songs That Would Be Good in this Scene{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="similar-songs"
              placeholder="Your Answer"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="track-length" className="block font-medium">
              Length of Track Needed (or use timestamps from video){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="track-length"
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
