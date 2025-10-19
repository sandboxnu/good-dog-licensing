"use client";

import { FormProvider, useForm } from "react-hook-form";
import InitialSignUpInfo from "./InitialSignUpInfo";
import z from "zod";
import { zSignUpValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import GrayPlaceholder from "../../../GrayPlaceholder";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import { trpc } from "@good-dog/trpc/client";
import { useState } from "react";
import { Dialog, DialogContent } from "@good-dog/ui/dialog";
import EmailCodeModal from "./EmailCodeModal";

interface SignUpWidgetProps {
  role: "MUSICIAN" | "MEDIA_MAKER" | undefined;
}

type SignUpFormFields = z.input<typeof zSignUpValues>;

export default function SignUpWidget({ role }: SignUpWidgetProps) {
  const formMethods = useForm<SignUpFormFields>({
    resolver: zodResolver(zSignUpValues),
    defaultValues: {
      role,
    },
  });

  const [displayEmailCodeModal, setDisplayEmailCodeModal] = useState(false);

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: async () => {
      setDisplayEmailCodeModal(true);
    },
    onError: (err) => {
      // TODO: Alert toast to the user that there was an error
      console.error(err);
    },
  });

  const verifyEmailCode = (code: string) => {
    console.log("verifying code");
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

  return (
    <UserOnboardingWidgetContainer>
      <EmailCodeModal
        isOpen={displayEmailCodeModal}
        close={() => setDisplayEmailCodeModal(false)}
        email={formMethods.watch("email")}
        verifyCode={verifyEmailCode}
      />
      <div className="w-1/2 flex flex-col justify-center h-full">
        <FormProvider {...formMethods}>
          <InitialSignUpInfo role={role} onVerifyEmail={handleVerifyEmail} />
        </FormProvider>
      </div>
      <div className="w-1/2 h-full">
        <GrayPlaceholder />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
