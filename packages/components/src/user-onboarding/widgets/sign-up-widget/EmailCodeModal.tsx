"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@good-dog/ui/input-otp";
import { useState } from "react";
import Modal from "../../../base/Modal";
import clsx from "clsx";
import ErrorExclamation from "../../../svg/ErrorExclamation";

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

  return (
    <Modal
      open={isOpen}
      onClose={close}
      headerText="Verify your email address"
      width={500}
      height={285}
    >
      <p className="text-body2 pt-[4px]">
        We sent a link to <strong>{email}</strong>
      </p>
      {codeIsWrong && (
        <div className="flex flex-row items-center justify-center gap-x-1 pt-[16px]">
          <ErrorExclamation size="medium" />
          <p className="text-body2 text-error font-medium">Incorrect code</p>
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
      <div className="pt-[16px] flex flex-row flex-wrap justify-center space-x-1 items-center">
        <p className="text-body2">Didn't get an email?</p>
        <button
          onClick={() => {
            setEmailCode("");
            resendEmail();
          }}
          type="button"
          className="text-body2 underline font-medium text-secondary"
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
        "!text-h1 h-[64px] w-[48px] border border-solid border-[#858585] rounded-[4px]",
        { "border-error shadown-error": error },
      )}
    />
  );
}
