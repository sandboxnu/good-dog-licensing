"use client";

import { zSignInValues } from "@good-dog/trpc/schema";
import { trpc } from "@good-dog/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import ErrorExclamation from "../../../svg/ErrorExclamation";
import GrayPlaceholder from "../../../GrayPlaceholder";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Checkbox from "../../../base/Checkbox";
import Link from "next/link";
import Button from "../../../base/Button";
import { useState } from "react";

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
      <div className="w-1/2 flex flex-col justify-center h-full">
        <FormProvider {...formMethods}>
          <form className="pr-[40px]" onSubmit={handleLogin}>
            <h3>Welcome back!</h3>
            <p>
              All fields below are required
            </p>
            {loginMutation.isError && (
              <div className="flex flex-row gap-[2px] items-center">
                <ErrorExclamation />
                <h3 className="text-error text-body3 font-normal ">
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
              <div className="pt-[24px] flex flex-row justify-between">
                <Checkbox label="Remember me" id="rememberMe" />
                <Link
                  href="/forgot-password"
                  className="text-secondary underline text-body3 font-medium whitespace-nowrap"
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
            <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 text-body3">
              <span className="font-normal">Don't have an account?</span>
              <Link
                href="/signup"
                className="underline font-medium text-secondary"
              >
                Sign up
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
      <div className="w-1/2 h-full">
        <GrayPlaceholder />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
