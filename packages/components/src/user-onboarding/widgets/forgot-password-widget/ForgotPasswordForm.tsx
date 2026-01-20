"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import Modal from "@good-dog/components/base/Modal";
import { trpc } from "@good-dog/trpc/client";
import { zForgotPasswordValues } from "@good-dog/trpc/schema";

import Button from "../../../base/Button";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import Link from "next/link";

type FormValues = z.input<typeof zForgotPasswordValues>;

export default function ForgotPasswordForm() {
  const forgotPasswordMutation = trpc.sendForgotPasswordEmail.useMutation();

  const forgotPasswordForm = useForm<FormValues>({
    resolver: zodResolver(zForgotPasswordValues),
    disabled: forgotPasswordMutation.isPending,
  });

  const onSubmit = forgotPasswordForm.handleSubmit((values) => {
    forgotPasswordMutation.mutate(values);
  });

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
        <div className="flex flex-row flex-wrap justify-center space-x-1 pt-[16px] text-body3">
              <span className="font-normal">Back to</span>
              <Link
                href="/login"
                className="font-medium text-secondary underline"
              >
                Login
              </Link>
            </div>
        <Modal
          open={
            forgotPasswordMutation.isSuccess &&
            !!forgotPasswordMutation.data.message
          }
          onClose={() => forgotPasswordMutation.reset()}
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
                <strong onClick={onSubmit}>
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
