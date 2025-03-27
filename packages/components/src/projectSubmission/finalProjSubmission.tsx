"use client";

import React from "react";

import { Input } from "@good-dog/components/input";
import { Textarea } from "@good-dog/components/textarea";
import { Button } from "@good-dog/ui/button";

export default function FinalProjSubmission() {
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
            <label htmlFor="project-additional" className="block font-medium">
              Tell us anything else about the Project
            </label>
            <Input
              id="project-additional"
              placeholder="Your Answer"
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="scene-additional" className="block font-medium">
              Tell us anything else about the Scene(s)
            </label>
            <Textarea
              id="scene-additional"
              placeholder="Your Answer"
              className="min-h-[100px] border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Button
              type="button"
              className="rounded bg-white px-8 py-2 font-medium text-emerald-600 hover:bg-gray-100"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="rounded bg-emerald-600 px-8 py-2 font-medium text-black hover:bg-emerald-600"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
