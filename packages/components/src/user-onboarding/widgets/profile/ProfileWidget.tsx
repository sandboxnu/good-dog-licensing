"use client";

import { trpc } from "@good-dog/trpc/client";
import { useRouter } from "next/navigation";
import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import ProfileIcon from "../../../svg/ProfileIcon";
import { useEffect } from "react";
import { getRoleLabel } from "../../../../utils/enumLabelMapper";

type ChangeEmailValuesFields = z.input<typeof zSetEmailValues>;
type ChangePasswordValuesFields = z.input<typeof zSetPasswordValues>;

export default function ProfileWidget() {
  const router = useRouter();
  const { data: user } = trpc.user.useQuery();

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

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] =
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

  const deleteAccountMutation = trpc.deleteAccount.useMutation({
    onSuccess: () => {
      setDisplayDeleteAccountModal(false);
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

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-6 w-[752px]">
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
      <DeleteAccountModal
        isOpen={displayDeleteAccountModal}
        close={() => setDisplayDeleteAccountModal(false)}
        onDeleteAccount={handleDeleteAccount}
      />
      <div className="flex flex-row items-center gap-4">
        <ProfileIcon color="light" size={56} />
        <div className="flex flex-col">
          <header className="text-good-dog-main dark:text-mint-200 text-xl font-semibold">
            {user?.firstName + " " + user?.lastName}
          </header>
          <div className="text-dark-gray-200">
            {userRoleFormatted} | Since {userCreatedAtFormatted}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-[16px]">
        <ProfileDetails />
        <ProfileSection header="Security">
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
            <div className="flex flex-row justify-between items-center">
              <InfoField header="Email" content={user ? user.email : ""} />
              <Button
                label="Change email"
                size="small"
                variant="outlined"
                onClick={() => setDisplaySetEmailModal(true)}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
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
        <ProfileSection header="Delete account" transparentHeader danger>
          <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[18px]">
            <div className="flex flex-row justify-left items-center text-dark-gray-300">
              <ErrorExclamation size="medium" /> This will permanently delete
              your account and all your information. This action can't be
              undone!
            </div>
            <div>
              <Button
                label="Delete account"
                size="small"
                variant="outlined"
                onClick={() => setDisplayDeleteAccountModal(true)}
                error={true}
              />
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}
