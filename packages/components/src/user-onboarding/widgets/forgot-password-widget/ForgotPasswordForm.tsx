"use client";

import type { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import Modal from "@good-dog/components/base/Modal";

import { trpc } from "@good-dog/trpc/client";
import { zForgotPasswordValues } from "@good-dog/trpc/schema";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Button from "../../../base/Button";

type FormValues = z.input<typeof zForgotPasswordValues>;

export default function ForgotPasswordForm() {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const forgotPasswordMutation = trpc.sendForgotPasswordEmail.useMutation({
    onSuccess: (data) => {
      setResponseMessage(data.message);
      setIsSuccess(true);
    },
    onError: (err) => {
      console.error(err);
      setResponseMessage(err.message);
      setIsSuccess(false);
    },
  });

  const forgotPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zForgotPasswordValues),
    disabled: forgotPasswordMutation.isPending,
  });

  const onSubmit = forgotPasswordForm.handleSubmit((values) => {
    forgotPasswordMutation.mutate(values);
  });

  const onResend = () =>
    forgotPasswordMutation.mutate(forgotPasswordForm.getValues());

  return (
    <FormProvider {...forgotPasswordForm}>
      <div className="pr-[40px]">
        <RHFTextInput<FormValues>
          rhfName={"email"}
          label={"Email"}
          placeholder={"example@gmail.com"}
          id="email"
          errorText={forgotPasswordForm.formState.errors.email?.message}
        />
        <div className="pt-[32px]">
          <Button
            onClick={onSubmit}
            variant="contained"
            size="large"
            label="Send email"
            fullWidth
            shadow
          />
        </div>
        <Modal
          open={isSuccess && !!responseMessage}
          onClose={() => setResponseMessage(null)}
          headerText={"Email has been sent"}
          height={212}
          width={440}
          children={
            <div className="gap-[8px]">
              <p>
                We sent a link to{" "}
                <strong>{forgotPasswordForm.getValues().email}</strong>
              </p>
              <p>
                Didn't receive the email?{" "}
                <strong onClick={onResend}>
                  <u>Resend</u>
                </strong>
              </p>
            </div>
          }
        ></Modal>
      </div>
    </FormProvider>
  );
}
