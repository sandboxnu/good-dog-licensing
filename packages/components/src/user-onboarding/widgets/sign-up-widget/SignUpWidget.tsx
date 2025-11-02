"use client";

import { FormProvider, useForm } from "react-hook-form";
import InitialSignUpInfo from "./InitialSignUpInfo";
import type z from "zod";
import { zSignUpValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import { trpc } from "@good-dog/trpc/client";
import { useEffect, useState } from "react";
import EmailCodeModal from "./EmailCodeModal";
import FinalSignUpInfo from "./FinalSignUpInfo";
import MusicianOnRecord from "../../../svg/onboarding/musician/MusicianOnRecord";
import Camera from "../../../svg/onboarding/media-maker/Camera";
import Teamwork from "../../../svg/onboarding/Teamwork";

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
      referral: "FRIEND",
      phoneNumber: "1234567890",
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
    onError: (err) => {
      // TODO: Alert toast to the user that there was an error
      console.error(err);
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
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      console.error(err);
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
        close={() => setDisplayEmailCodeModal(false)}
        email={formMethods.watch("email")}
        verifyCode={verifyEmailCode}
        resendEmail={handleVerifyEmail}
        codeIsWrong={emailCodeError}
      />
      <div className="w-1/2 flex flex-col justify-center h-full">
        <FormProvider {...formMethods}>
          {step === 1 && (
            <InitialSignUpInfo role={role} onVerifyEmail={handleVerifyEmail} />
          )}
          {step === 2 && (
            <FinalSignUpInfo role={role} onSubmit={handleSubmit} />
          )}
        </FormProvider>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center">
        {role === "MUSICIAN" && <MusicianOnRecord />}
        {role === "MEDIA_MAKER" && <Camera />}
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {!role && <Teamwork />}
      </div>
    </UserOnboardingWidgetContainer>
  );
}
