"use client";

import type z from "zod";
import Modal from "../../../base/Modal";

import { zSetEmailValues } from "@good-dog/trpc/schema";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import { useFormContext } from "react-hook-form";
import Button from "../../../base/Button";

interface SetEmailModalProps {
  isOpen: boolean;
  close: () => void;
  onVerifyEmail: () => void;
  resendEmail: () => void;
  emailAlreadyExists: boolean;
  error: boolean;
}

type SetEmailFormFields = z.input<typeof zSetEmailValues>;

export default function SetEmailModal({
  isOpen,
  close,
  onVerifyEmail,
  resendEmail,
  emailAlreadyExists,
  error,
}: SetEmailModalProps) {
  const {
    formState: { errors },
  } = useFormContext<SetEmailFormFields>();

  return (
    <div className="flex flex-col">
      <Modal
        open={isOpen}
        onClose={close}
        headerText="Set new email"
        width={500}
        height={322}
      >
        <div className="w-3/4 pt-4">
          <RHFTextInput<SetEmailFormFields>
            rhfName="email"
            label="Email"
            placeholder="example@email.com"
            id="email"
            errorText={
              emailAlreadyExists
                ? "User with email already exists"
                : errors.email?.message
            }
            required
          />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center space-x-1 py-4">
          <p className="text-body2">Didn't get an email?</p>
          <button
            onClick={() => {
              resendEmail();
            }}
            type="button"
            className="text-body2 font-medium text-secondary underline"
          >
            Resend
          </button>
        </div>
        <Button
          label="Verify email"
          size="small"
          variant="contained"
          onClick={onVerifyEmail}
        ></Button>
      </Modal>
    </div>
  );
}
