"use client";

import type z from "zod";
import { useFormContext } from "react-hook-form";

import type { zSetPasswordValues } from "@good-dog/trpc/schema";

import Button from "../../../base/Button";
import Modal from "../../../base/Modal";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import PasswordRequirements from "../components/PasswordRequirements";

interface SetPasswordModalProps {
  isOpen: boolean;
  close: () => void;
  onSetPassword: (newPassword: string) => void;
  errorMessage?: string;
}

type SetPasswordFormFields = z.input<typeof zSetPasswordValues>;

export default function SetPasswordModal({
  isOpen,
  close,
  onSetPassword,
  errorMessage,
}: SetPasswordModalProps) {
  const {
    handleSubmit,
    formState: { errors },
  } = useFormContext<SetPasswordFormFields>();

  const onSubmit = (data: SetPasswordFormFields) => {
    onSetPassword(data.password);
  };

  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Change password"
      width={500}
      height={404}
    >
      <div className="flex w-3/4 flex-col gap-4 pt-4">
        <div className="flex flex-col gap-[8px]">
          {errorMessage && (
            <div className="flex flex-row items-center gap-[4px] pt-[12px]">
              <ErrorExclamation size="medium" />
              <p className="text-error">{errorMessage}</p>
            </div>
          )}
          <RHFTextInput<SetPasswordFormFields>
            rhfName="password"
            label="Password"
            placeholder="Your password"
            id="password"
            errorText={errors.password?.message}
            type="password"
          />
          {!errors.password?.message && <PasswordRequirements />}
        </div>
        <RHFTextInput<SetPasswordFormFields>
          rhfName="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter password"
          id="confirmPassword"
          errorText={errors.confirmPassword?.message}
          type="password"
        />
        <div>
          <Button
            label="Set new password"
            size="small"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </Modal>
  );
}
