"use client";

import { FormProvider, useForm } from "react-hook-form";
import GrayPlaceholder from "../../GrayPlaceholder";
import InitialSignUpInfo from "./InitialSignUpInfo";
import z from "zod";
import { zSignUpValues } from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";

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

  // const [step, setStep] = useState<number>(1);

  const handleVerifyEmail = async () => {
    const initialSignUpInfoIsValid = await formMethods.trigger([
      "firstName",
      "lastName",
      "email",
    ]);
    if (initialSignUpInfoIsValid) {
      console.log("Sending email verification");
      // setStep(2);
    } else {
      console.log("Not valid");
    }
  };

  return (
    <div className="rounded-sign-up-widget bg-sign-up-widget border-black border border-solid h-sign-up-widget p-[48px]">
      <div className="flex h-full">
        <div className="w-1/2">
          <FormProvider {...formMethods}>
            <InitialSignUpInfo role={role} onVerifyEmail={handleVerifyEmail} />
          </FormProvider>
        </div>
        <div className="w-1/2 h-full">
          <GrayPlaceholder />
        </div>
      </div>
    </div>
  );
}
