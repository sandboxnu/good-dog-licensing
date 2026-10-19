"use client";

import type z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSignUpValues } from "@good-dog/trpc/schema";

import Camera from "../../../svg/onboarding/media-maker/Camera";
import MusicianOnRecord from "../../../svg/onboarding/musician/MusicianOnRecord";
import SignupIdea from "../../../svg/onboarding/SignupIdea";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import EmailCodeModal from "./EmailCodeModal";
import FinalSignUpInfo from "./FinalSignUpInfo";
import InitialSignUpInfo from "./InitialSignUpInfo";

interface SignUpWidgetProps {
  initialRole: "MUSICIAN" | "MEDIA_MAKER" | undefined;
  onRoleChange: (newRole: "MUSICIAN" | "MEDIA_MAKER" | undefined) => void;
}

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function SignUpWidget({
  initialRole,
  onRoleChange,
}: SignUpWidgetProps) {
  const formMethods = useForm<SignUpFormFields>({
    resolver: zodResolver(zSignUpValues),
    defaultValues: {
      role: initialRole,
      howHeardAboutUs: undefined,
    },
  });

  const role = formMethods.watch("role");

  useEffect(() => {
    onRoleChange(role);
  }, [role, onRoleChange]);

  const [displayEmailCodeModal, setDisplayEmailCodeModal] = useState(false);
  const [step, setStep] = useState(1);
  const [emailCodeError, setEmailCodeError] = useState(false);
  const [emailCodeNotice, setEmailCodeNotice] = useState<string>();
  // Remounts the code modal each time it opens so it never shows a stale code
  const [emailCodeModalKey, setEmailCodeModalKey] = useState(0);

  const openEmailCodeModal = () => {
    setEmailCodeModalKey((key) => key + 1);
    setDisplayEmailCodeModal(true);
  };

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: () => {
      openEmailCodeModal();
    },
  });

  const verifyEmailCodeMutation = trpc.verifyEmailCode.useMutation({
    onSuccess: () => {
      setDisplayEmailCodeModal(false);
      setEmailCodeError(false);
      setStep(2);
    },
    onError: () => {
      setEmailCodeError(true);
    },
  });

  const signUpMutation = trpc.signUp.useMutation({
    onSuccess: (data) => {
      if ("status" in data) {
        // The code expired, so the server sent a new one
        setEmailCodeNotice(data.message);
        openEmailCodeModal();
      } else {
        window.location.href = "/home";
      }
    },
    onError: (error) => {
      if (error.data?.code === "FORBIDDEN") {
        // The verified code is no longer valid, so send a fresh one
        setEmailCodeNotice(
          "Please verify your email again. We sent you a new code.",
        );
        sendEmailVerificationMutation.mutate({
          email: formMethods.getValues("email"),
        });
      }
    },
  });

  const getSignUpErrorMessage = () => {
    switch (signUpMutation.error?.data?.code) {
      case undefined:
        return undefined;
      case "FORBIDDEN":
        // Handled by re-sending the code, unless that also failed
        return sendEmailVerificationMutation.error
          ? "Internal Error. Please try again."
          : undefined;
      case "CONFLICT":
        return "An account with this email already exists. Please log in instead.";
      default:
        return "Internal Error. Please try again.";
    }
  };

  const verifyEmailCode = (code: string) => {
    formMethods.setValue("emailCode", code);
    verifyEmailCodeMutation.mutate({
      email: formMethods.watch("email"),
      emailCode: code,
    });
  };

  const handleVerifyEmail = async () => {
    setEmailCodeNotice(undefined);
    sendEmailVerificationMutation.reset();
    const initialSignUpInfoIsValid = await formMethods.trigger([
      "firstName",
      "lastName",
      "email",
      "role",
    ]);
    if (initialSignUpInfoIsValid) {
      sendEmailVerificationMutation.mutate({
        email: formMethods.watch("email"),
      });
    }
  };

  const handleSubmit = formMethods.handleSubmit((values) => {
    signUpMutation.mutate(values);
  });

  return (
    <UserOnboardingWidgetContainer>
      <EmailCodeModal
        key={emailCodeModalKey}
        isOpen={displayEmailCodeModal}
        close={() => {
          setDisplayEmailCodeModal(false);
          setEmailCodeError(false);
        }}
        email={formMethods.watch("email")}
        verifyCode={verifyEmailCode}
        resendEmail={handleVerifyEmail}
        codeIsWrong={emailCodeError}
        notice={emailCodeNotice}
      />
      <div className="flex w-1/2 flex-col justify-center">
        <FormProvider {...formMethods}>
          {step === 1 && (
            <InitialSignUpInfo
              role={role}
              onVerifyEmail={handleVerifyEmail}
              errorMessage={
                sendEmailVerificationMutation.error &&
                sendEmailVerificationMutation.error.data?.code !== "CONFLICT"
                  ? "Internal Error. Please try again."
                  : undefined
              }
              emailAlreadyExists={
                sendEmailVerificationMutation.error?.data?.code === "CONFLICT"
              }
            />
          )}
          {step === 2 && (
            <FinalSignUpInfo
              role={role}
              onSubmit={handleSubmit}
              errorMessage={getSignUpErrorMessage()}
            />
          )}
        </FormProvider>
      </div>
      <div className="flex w-1/2 pl-[20px]">
        <div className="flex w-full flex-col justify-center">
          {role === "MUSICIAN" && <MusicianOnRecord />}
          {role === "MEDIA_MAKER" && <Camera />}
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
          {!role && <SignupIdea />}
        </div>
      </div>
    </UserOnboardingWidgetContainer>
  );
}
