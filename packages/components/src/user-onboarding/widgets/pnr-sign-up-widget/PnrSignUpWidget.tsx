import { FormProvider, useForm } from "react-hook-form";
import PnrSignUpImage from "../../../svg/onboarding/PnrSignUpImage";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import { zModeratorSignUpValues } from "@good-dog/trpc/schema";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PnrSignUpForm from "./PnrSignUpForm";
import { trpc } from "@good-dog/trpc/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type PnrSignUpFormFields = z.input<typeof zModeratorSignUpValues>;

export default function PnrSignUpWidget() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite_id");

  const formMethods = useForm<PnrSignUpFormFields>({
    resolver: zodResolver(zModeratorSignUpValues),
    defaultValues: {
      moderatorInviteId: inviteId ?? "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const pnrSignUpMutation = trpc.onboardModerator.useMutation({
    onSuccess: (data) => {
      if (data.status === "RESENT") {
        setErrorMessage(
          "Your invite link has expired. A new invite link has been sent to your email.",
        );
      } else {
        window.location.href = "/home";
      }
    },
    onError: (error) => {
      if (error.data?.code === "FORBIDDEN") {
        setErrorMessage(
          "Your invite link is invalid. Please request a new one.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    },
  });

  const handleSubmit = formMethods.handleSubmit((values) => {
    pnrSignUpMutation.mutate(values);
  });

  if (!inviteId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Invalid invite link. Please request a new one.
        </p>
      </div>
    );
  }

  return (
    <UserOnboardingWidgetContainer>
      <div className="flex h-full w-1/2 flex-col justify-center">
        <FormProvider {...formMethods}>
          <PnrSignUpForm onSubmit={handleSubmit} errorMessage={errorMessage} />
        </FormProvider>
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        <PnrSignUpImage />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
