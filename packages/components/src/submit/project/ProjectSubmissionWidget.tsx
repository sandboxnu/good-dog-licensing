"use client";

import { FormProvider, useForm } from "react-hook-form";
import type z from "zod";
import { zProjectSubmissionValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InitialProjectInfo from "./InitialProjectInfo";

type SignUpFormFields = z.input<typeof zProjectSubmissionValues>;

export default function ProjectSubmissionWidget() {
  const formMethods = useForm<SignUpFormFields>({
    resolver: zodResolver(zProjectSubmissionValues),
  });

  const handleNext = async () => {
    const initialProjectInfoIsValid = await formMethods.trigger([
      "projectTitle",
      "description",
      "deadline",
    ]);
    if (initialProjectInfoIsValid) {
      console.log("Sending to next step");
    } else {
      console.log("Not valid");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center max-w-[752px]">
      <div className="text-black border-[.5px] bg-white py-6 px-10 gap-6 flex flex-col border-black rounded-2xl">
        <p className="text-5xl font-medium">Song request form</p>
        <p className="text-lg font-medium">
          Need help finding a song from our catalog? Submit a brief and one of
          our curators will get back to you with suitable music from our
          library. The more specific you are, the better we can assist!
        </p>
        <p className="text-good-dog-red font-semibold">
          * Indicates a required question.
        </p>
      </div>
      <div className="flex w-full">
        <FormProvider {...formMethods}>
          <InitialProjectInfo onNext={handleNext} />
        </FormProvider>
      </div>
    </div>
  );
}
