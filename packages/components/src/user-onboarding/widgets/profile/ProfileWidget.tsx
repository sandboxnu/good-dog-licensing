"use client";

import type z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { trpc } from "@good-dog/trpc/client";
import { zSetEmailValues, zSetPasswordValues } from "@good-dog/trpc/schema";

import { getRoleLabel } from "../../../../utils/enumLabelMapper";
import Button from "../../../base/Button";
import ProfileIcon from "../../../svg/ProfileIcon";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import EmailCodeModal from "../sign-up-widget/EmailCodeModal";
import DeactivateAccountModal from "./DeactivateAccountModal";
import InfoField from "./InfoField";
import ProfileDetails from "./ProfileDetails";
import ProfileSection from "./ProfileSection";
import SetEmailModal from "./SetEmailModal";
import SetPasswordModal from "./SetPasswordModal";

type ChangeEmailValuesFields = z.input<typeof zSetEmailValues>;
type ChangePasswordValuesFields = z.input<typeof zSetPasswordValues>;

export default function ProfileWidget() {
  const router = useRouter();
  const [user] = trpc.user.useSuspenseQuery();

  const emailFormMethods = useForm<ChangeEmailValuesFields>({
    resolver: zodResolver(zSetEmailValues),
  });

  const passwordFormMethods = useForm<ChangePasswordValuesFields>({
    resolver: zodResolver(zSetPasswordValues),
  });

  const userRoleFormatted = user ? getRoleLabel(user.role) : "Unknown";
  const userCreatedAtFormatted = user
    ? user.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const [displaySetEmailModal, setDisplaySetEmailModal] = useState(false); // which email to change to
  const [displayEmailCodeModal, setDisplayEmailCodeModal] = useState(false); // code verification
  const [submitEmailCodeError, setSubmitEmailCodeError] = useState(false);

  const [displaySetPasswordModal, setDisplaySetPasswordModal] = useState(false);

  const [displayDeactivateAccountModal, setDisplayDeactivateAccountModal] =
    useState(false);

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: () => {
      setDisplaySetEmailModal(false);
      setDisplayEmailCodeModal(true);
    },
  });

  const verifyEmailCodeMutation = trpc.verifyEmailCode.useMutation({
    onSuccess: () => {
      setDisplayEmailCodeModal(false);
      setSubmitEmailCodeError(false);
    },
    onError: () => {
      setSubmitEmailCodeError(true);
    },
  });

  const changePasswordMutation = trpc.changePassword.useMutation({
    onSuccess: () => {
      setDisplaySetPasswordModal(false);
    },
  });

  const deactivateSelfMutation = trpc.deactivateSelf.useMutation({
    onSuccess: () => {
      setDisplayDeactivateAccountModal(false);
      router.push("/");
    },
  });

  const handleCloseChangePasswordModal = () => {
    passwordFormMethods.reset();
    setDisplaySetPasswordModal(false);
  };

  const handleCloseSetEmailModal = () => {
    emailFormMethods.reset();
    setDisplaySetEmailModal(false);
  };

  const verifyEmailCode = (code: string) => {
    emailFormMethods.setValue("emailCode", code);
    verifyEmailCodeMutation.mutate({
      email: emailFormMethods.watch("email"),
      emailCode: code,
    });
  };

  const handleVerifyEmail = async () => {
    sendEmailVerificationMutation.reset();
    const requestedEmailIsValid = await emailFormMethods.trigger(["email"]);
    if (requestedEmailIsValid) {
      sendEmailVerificationMutation.mutate({
        email: emailFormMethods.watch("email"),
      });
    }
  };

  const handleChangePassword = (newPassword: string) => {
    changePasswordMutation.mutate({
      newPassword,
    });
  };

  const handleDeactivateAccount = () => {
    deactivateSelfMutation.mutate();
  };

  return (
    <div className="flex w-[752px] flex-col gap-6">
      <FormProvider {...emailFormMethods}>
        <SetEmailModal
          isOpen={displaySetEmailModal}
          close={handleCloseSetEmailModal}
          onCancel={handleCloseSetEmailModal}
          onVerifyEmail={handleVerifyEmail}
          emailAlreadyExists={
            sendEmailVerificationMutation.error?.data?.code === "CONFLICT"
          }
          errorMessage={
            sendEmailVerificationMutation.error &&
            sendEmailVerificationMutation.error.data?.code !== "CONFLICT"
              ? "Internal Error. Please try again."
              : undefined
          }
        />
        <EmailCodeModal
          isOpen={displayEmailCodeModal}
          close={() => setDisplayEmailCodeModal(false)}
          email={emailFormMethods.watch("email")}
          verifyCode={verifyEmailCode}
          resendEmail={handleVerifyEmail}
          codeIsWrong={submitEmailCodeError}
        />
      </FormProvider>
      <FormProvider {...passwordFormMethods}>
        <SetPasswordModal
          isOpen={displaySetPasswordModal}
          close={handleCloseChangePasswordModal}
          onSetPassword={handleChangePassword}
          errorMessage={
            changePasswordMutation.error
              ? "Internal Error. Please try again."
              : undefined
          }
        />
      </FormProvider>
      <DeactivateAccountModal
        isOpen={displayDeactivateAccountModal}
        close={() => setDisplayDeactivateAccountModal(false)}
        onDeactivateAccount={handleDeactivateAccount}
      />
      <div className="flex flex-row items-center gap-4">
        <ProfileIcon color="light" size={56} />
        <div className="flex flex-col">
          <header className="text-xl font-semibold text-green-400 dark:text-mint-200">
            {user?.firstName + " " + user?.lastName}
          </header>
          <div className="text-dark-gray-200 dark:text-dark-gray-100">
            {userRoleFormatted} | Since {userCreatedAtFormatted}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-[16px]">
        <ProfileDetails />
        <ProfileSection header="Security">
          <div className="flex flex-col gap-y-6 rounded-2xl p-6">
            <div className="flex flex-row items-center justify-between">
              <InfoField header="Email" content={user ? user.email : ""} />
              <Button
                label="Change email"
                size="small"
                variant="outlined"
                onClick={() => setDisplaySetEmailModal(true)}
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <InfoField header="Password" content="**********" />
              <Button
                label="Change password"
                size="small"
                variant="outlined"
                onClick={() => setDisplaySetPasswordModal(true)}
              />
            </div>
          </div>
        </ProfileSection>
        <ProfileSection header="Deactivate account" transparentHeader danger>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-4">
            <div className="justify-left flex flex-row items-center gap-1 text-dark-gray-500 dark:text-gray-300">
              <div className="text-red-400 dark:text-red-300">
                <ErrorExclamation size="medium" />
              </div>
              This will deactivate your account until you choose to reactivate
              it.
            </div>
            <div>
              <Button
                label="Deactivate account"
                size="small"
                variant="contained"
                onClick={() => setDisplayDeactivateAccountModal(true)}
                error={true}
              />
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}
