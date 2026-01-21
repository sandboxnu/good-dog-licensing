"use client";

import type z from "zod";
import Modal from "../../../base/Modal";

import { zSetEmailValues } from "@good-dog/trpc/schema";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import { useFormContext } from "react-hook-form";
import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";

interface SetEmailModalProps {
  isOpen: boolean;
  close: () => void;
  onCancel: () => void;
  onVerifyEmail: () => void;
  emailAlreadyExists: boolean;
  errorMessage?: String;
}

type SetEmailFormFields = z.input<typeof zSetEmailValues>;

export default function SetEmailModal({
  isOpen,
  close,
  onCancel,
  onVerifyEmail,
  emailAlreadyExists,
  errorMessage,
}: SetEmailModalProps) {
  const {
    formState: { errors },
  } = useFormContext<SetEmailFormFields>();

  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Set new email"
      width={500}
      height={283}
    >
      <div className="w-3/4 py-4">
        {errorMessage && (
          <div className="flex flex-row items-center gap-[4px] pt-[12px]">
            <ErrorExclamation size="medium" />
            <p className="text-error">{errorMessage}</p>
          </div>
        )}
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
      <div className="space-x-2">
        <Button
          label="Cancel"
          size={"small"}
          variant="outlined"
          onClick={onCancel}
        />
        <Button
          label="Verify email"
          size="small"
          variant="contained"
          onClick={onVerifyEmail}
        />
      </div>
    </Modal>
  );
}
