"use client";

import type { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSignInValues } from "@good-dog/trpc/schema";

import Button from "../../../base/Button";
import Checkbox from "../../../base/Checkbox";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import ErrorExclamation from "../../../svg/ErrorExclamation";
import TeamworkLogin from "../../../svg/onboarding/TeamworkLogin";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";

type LoginFormFields = z.input<typeof zSignInValues>;

export default function LoginWidget() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formMethods = useForm<LoginFormFields>({
    resolver: zodResolver(zSignInValues),
  });

  const handleLogin = formMethods.handleSubmit((values) => {
    loginMutation.mutate(values);
  });

  const trpcUtils = trpc.useUtils();

  const loginMutation = trpc.signIn.useMutation({
    onSuccess: async () => {
      await trpcUtils.user.reset();

      // TODO: Alert toast to the user that they have successfully logged in
      router.push("/");
    },
    onError: (err) => {
      // TODO: Alert toast to the user that there was an error logging in
      console.error(err);

      if (err.data?.code === "UNAUTHORIZED") {
        // this message is hard coded from sign in procedure
        setErrorMessage("The email or password entered is incorrect");
      } else {
        setErrorMessage("Something went wrong. Please try again later");
      }
    },
  });

  return (
    <UserOnboardingWidgetContainer>
      <div className="flex h-full w-1/2 flex-col justify-center">
        <FormProvider {...formMethods}>
          <form className="pr-[40px]" onSubmit={handleLogin}>
            <h3 className="text-green-400 dark:text-mint-200">Welcome back!</h3>
            <p className="text-dark-gray-600 dark:text-gray-100">
              All fields below are required
            </p>
            {loginMutation.isError && (
              <div className="flex flex-row items-center gap-[2px]">
                <ErrorExclamation size="medium" />
                <h3 className="text-body3 font-normal text-error">
                  {errorMessage}
                </h3>
              </div>
            )}
            <div className="pt-[32px]">
              <RHFTextInput<LoginFormFields>
                rhfName={"email"}
                label={"Email"}
                placeholder={"example@gmail.com"}
                id="email"
                errorText={formMethods.formState.errors.email?.message}
              />
            </div>
            <div className="pt-[24px]">
              <RHFTextInput<LoginFormFields>
                rhfName={"password"}
                label={"Password"}
                placeholder={"Enter password"}
                id="password"
                type="password"
                errorText={formMethods.formState.errors.password?.message}
              />
              <div className="flex flex-row justify-between pt-[24px]">
                <Checkbox label="Remember me" id="rememberMe" />
                <Link
                  href="/forgot-password"
                  className="whitespace-nowrap text-body3 font-medium text-secondary underline text-green-500 dark:text-mint-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="pt-[32px]">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  label="Sign in"
                  fullWidth
                  shadow
                />
              </div>
            </div>
            <div className="flex flex-row flex-wrap justify-center space-x-1 pt-[16px] text-body3">
              <span className="font-normal text-dark-gray-500 text-gray-200">
                Don't have an account?
              </span>
              <Link
                href="/signup"
                className="font-medium text-secondary underline text-green-500 dark:text-mint-200"
              >
                Sign up
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        <TeamworkLogin />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
