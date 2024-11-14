"use client";

import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { Button } from "@good-dog/ui/button";

interface BaseValues {
  role: "MEDIA_MAKER" | "MUSICIAN";
  firstName: string;
  lastName: string;
  discovery?: string;
}

export default function OnboardingFormProvider<
  Values extends FieldValues & BaseValues,
  T extends z.ZodObject<
    Record<keyof Values, z.ZodTypeAny>,
    z.UnknownKeysParam,
    z.ZodTypeAny,
    Values
  >,
>(
  props: Readonly<{
    children: ReactNode;
    schema: T;
    firstName: string;
    lastName: string;
    role: "MEDIA_MAKER" | "MUSICIAN";
  }>,
) {
  const router = useRouter();

  const onboardingForm = useForm<BaseValues>({
    resolver: zodResolver(props.schema),
    defaultValues: {
      role: props.role,
      firstName: props.firstName,
      lastName: props.lastName,
    },
  });

  const onboardingMutation = trpc.onboarding.useMutation({
    onSuccess: () => {
      router.replace("/");
      // TODO
      // Show a toast or something to the user that they have successfully onboarded
    },
    onError: (err) => {
      Object.entries(err.data?.zodError?.fieldErrors ?? {}).forEach(
        ([key, fieldError]) => {
          if (fieldError && key in props.schema.shape) {
            // Technically, the wrong type here, but the type check on the line
            // will handle it at runtime
            onboardingForm.setError(key as keyof BaseValues, {
              message: fieldError.join(", "),
            });
          }
        },
      );
      // TODO
      // Alert toast to the user that there was an error onboarding
      console.error(err);
    },
  });

  // Submitting the form will finish the onboarding process
  const onSubmit = onboardingForm.handleSubmit((values) => {
    onboardingMutation.mutate(values);
  });

  return (
    <FormProvider {...onboardingForm}>
      <form onSubmit={onSubmit}>
        {props.children}
        <Button
          type="submit"
          className="text-green-500"
          disabled={onboardingMutation.isPending}
        >
          Sign Up
        </Button>
      </form>
    </FormProvider>
  );
}
