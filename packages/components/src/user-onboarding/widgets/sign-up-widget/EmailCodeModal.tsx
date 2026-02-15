"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";

import Modal from "../../../base/Modal";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";

interface EmailCodeModalProps {
  isOpen: boolean;
  close: () => void;
  email: string;
  verifyCode: (code: string) => void;
  resendEmail: () => void;
  codeIsWrong: boolean;
}

export default function EmailCodeModal({
  isOpen,
  close,
  email,
  verifyCode,
  resendEmail,
  codeIsWrong = true,
}: EmailCodeModalProps) {
  const [emailCode, setEmailCode] = useState<string>("");

  useEffect(() => {
    if (!isOpen) setEmailCode("");
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Verify your email address"
      width={500}
      height={300}
    >
      <p className="pt-[4px] text-body2 text-dark-gray-500 dark:text-gray-200">
        We sent a link to <strong>{email}</strong>
      </p>
      {codeIsWrong && (
        <div className="flex flex-row items-center justify-center gap-x-1 pt-[16px]">
          <ErrorExclamation size="medium" />
          <p className="text-body2 font-medium text-red-400 dark:text-red-300">
            Incorrect code
          </p>
        </div>
      )}
      <div className="pt-[16px]">
        <InputOTP
          maxLength={6}
          value={emailCode}
          onChange={(newCode) => {
            setEmailCode(newCode);
            if (newCode.length == 6) {
              verifyCode(newCode);
            }
          }}
        >
          <InputOTPGroup className="flex flex-row gap-[16px]">
            <OPTSlot index={0} error={codeIsWrong} />
            <OPTSlot index={1} error={codeIsWrong} />
            <OPTSlot index={2} error={codeIsWrong} />
            <OPTSlot index={3} error={codeIsWrong} />
            <OPTSlot index={4} error={codeIsWrong} />
            <OPTSlot index={5} error={codeIsWrong} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center space-x-1 pt-[16px] pb-[56px]">
        <p className="text-body2 text-dark-gray-500 dark:text-gray-200">
          Didn't get an email?
        </p>
        <button
          onClick={() => {
            setEmailCode("");
            resendEmail();
          }}
          type="button"
          className="text-body2 font-medium text-secondary underline dark:text-gray-100"
        >
          Resend
        </button>
      </div>
    </Modal>
  );
}

function OPTSlot({ index, error }: { index: number; error: boolean }) {
  return (
    <InputOTPSlot
      index={index}
      className={clsx(
        "h-[64px] w-[48px] rounded-[4px] border border-solid border-green-400 dark:text-mint-200 dark:border-mint-200 !text-h1",
        {
          "shadow-red-400 border-red-400 dark:shadow-red-300 dark:border-red-300":
            error,
        },
      )}
    />
  );
}
