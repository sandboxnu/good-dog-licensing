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
      howHeardAboutUs: [],
    },
  });

  const role = formMethods.watch("role");

  useEffect(() => {
    onRoleChange(role);
  }, [role, onRoleChange]);

  const [displayEmailCodeModal, setDisplayEmailCodeModal] = useState(false);
  const [step, setStep] = useState(1);
  const [emailCodeError, setEmailCodeError] = useState(false);

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: () => {
      setDisplayEmailCodeModal(true);
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
      if (data.status === "RESENT") {
        setDisplayEmailCodeModal(true);
      } else {
        window.location.href = "/";
      }
    },
  });

  const verifyEmailCode = (code: string) => {
    formMethods.setValue("emailCode", code);
    verifyEmailCodeMutation.mutate({
      email: formMethods.watch("email"),
      emailCode: code,
    });
  };

  const handleVerifyEmail = async () => {
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
        isOpen={displayEmailCodeModal}
        close={() => {
          setDisplayEmailCodeModal(false);
          setEmailCodeError(false);
        }}
        email={formMethods.watch("email")}
        verifyCode={verifyEmailCode}
        resendEmail={handleVerifyEmail}
        codeIsWrong={emailCodeError}
      />
      <div className="flex h-full w-1/2 flex-col justify-center">
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
              errorMessage={
                signUpMutation.error
                  ? "Internal Error. Please try again."
                  : undefined
              }
            />
          )}
        </FormProvider>
      </div>
      <div className="flex h-full w-1/2 items-center justify-center">
        {role === "MUSICIAN" && <MusicianOnRecord />}
        {role === "MEDIA_MAKER" && <Camera />}
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {!role && <SignupIdea />}
      </div>
    </UserOnboardingWidgetContainer>
  );
}
