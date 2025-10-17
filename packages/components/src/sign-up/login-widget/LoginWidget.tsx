"use client";

import { zSignInValues } from "@good-dog/trpc/schema";
import { trpc } from "@good-dog/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import RHFTextInput from "../../rhf-base/RHFTextInput";
import GrayPlaceholder from "../../GrayPlaceholder";
import { Button } from "@good-dog/ui/button";
import { Checkbox } from "@good-dog/ui/checkbox";
import Link from "next/link";
import LoginInfo from "./LoginInfo";

type LoginFormFields = z.input<typeof zSignInValues>;

export default function LoginWidget() {
  const router = useRouter();
  const loginMethod = useForm<LoginFormFields>({
    resolver: zodResolver(zSignInValues),
  });

  const handleVeridyCredentials = loginMethod.handleSubmit((values) => {
    loginMutation.mutate(values);
  })

  const trpcUtils = trpc.useUtils();

  const loginMutation = trpc.signIn.useMutation({
    onSuccess: async () => {
      await trpcUtils.user.reset();

      // TODO: alert the user that they have successfully logged in
      router.push("/");
    },
    onError: (err) => {
      // TODO: Alert toast to the user that there was an error logging in (not sure what this means)
      console.error(err);
    },
  });


  return (
    <div className="rounded-sign-up-widget bg-sign-up-widget border-black border border-solid h-sign-up-widget p-[48px]">
      <div className="flex h-full">
        <div className="w-1/2">
          <FormProvider {...loginMethod}>
            <LoginInfo onVerifyCredentials={handleVeridyCredentials} />
          </FormProvider>
        </div>
        <div className="w-1/2 h-full">
          <GrayPlaceholder />
        </div>
      </div>
    </div >

  )
};


