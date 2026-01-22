"use client";

import { trpc } from "@good-dog/trpc/client";
import { useRouter } from "next/navigation";
import Button from "../../../base/Button";
import ErrorExclamation from "../../../svg/status-icons/ErrorExclamation";
import ProfileIcon from "../../../svg/ProfileIcon";
import { useEffect, useState } from "react";
import SetEmailModal from "./SetEmailModal";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import {
  zSetEmailValues,
  zSetPasswordValues,
  zProfileValues,
} from "@good-dog/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailCodeModal from "../sign-up-widget/EmailCodeModal";
import RHFTextInput from "../../../rhf-base/RHFTextInput";
import { MusicAffiliation } from "@good-dog/db";
import SetPasswordModal from "./SetPasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import {
  getMusicAffiliationLabel,
  getRoleLabel,
} from "../../../../utils/enumLabelMapper";
import RHFDropdown from "../../../rhf-base/RHFDropdown";

function InfoField({ header, content }: { header: string; content: string }) {
  return (
    <div className="flex flex-col">
      <header className="text-dark-gray-200">{header}</header>
      <div>{content}</div>
    </div>
  );
}

type ProfileValuesFields = z.input<typeof zProfileValues>;
type ChangeEmailValuesFields = z.input<typeof zSetEmailValues>;
type ChangePasswordValuesFields = z.input<typeof zSetPasswordValues>;

export default function ProfileWidget() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: user, isLoading } = trpc.user.useQuery();

  const profileFormMethods = useForm<ProfileValuesFields>({
    resolver: zodResolver(zProfileValues),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      ipi: user?.ipi ? user.ipi : "",
      affiliation: user?.affiliation
        ? user?.affiliation
        : MusicAffiliation.NONE,
    },
  });

  const emailFormMethods = useForm<ChangeEmailValuesFields>({
    resolver: zodResolver(zSetEmailValues),
  });

  const passwordFormMethods = useForm<ChangePasswordValuesFields>({
    resolver: zodResolver(zSetPasswordValues),
  });

  const userCreatedAtFormatted = user
    ? user.createdAt.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);

  const [displaySetEmailModal, setDisplaySetEmailModal] = useState(false); // which email to change to
  const [displayEmailCodeModal, setDisplayEmailCodeModal] = useState(false); // code verification
  const [submitEmailCodeError, setSubmitEmailCodeError] = useState(false);

  const [displaySetPasswordModal, setDisplaySetPasswordModal] = useState(false);

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] =
    useState(false);

  const sendEmailVerificationMutation = trpc.sendEmailVerification.useMutation({
    onSuccess: () => {
      handleCloseSetEmailModal();
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

  const changeProfileValuesMutation = trpc.changeProfileValues.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
      setEditingPersonalDetails(false);
    },
    // TODO: right now, when the user saves, the RHFTextInput doesn't tell them they can't have an empty first/last name
    // To fix it though, I'd need to change how error is displayed in the RHFTextInput that would end up everywhere.
  });

  const handleCloseSetEmailModal = () => {
    emailFormMethods.reset();
    setDisplaySetEmailModal(false);
  };

  const handleCloseChangePasswordModal = () => {
    passwordFormMethods.reset();
    setDisplaySetPasswordModal(false);
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

  const handleChangeProfileValues = profileFormMethods.handleSubmit((data) => {
    changeProfileValuesMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      affiliation: data.affiliation,
      ipi: data.ipi,
    });
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const affiliations = Object.values(MusicAffiliation).map((affiliation) => ({
    label:
      getMusicAffiliationLabel(affiliation) === "Neither"
        ? "NONE"
        : getMusicAffiliationLabel(affiliation),
    value: affiliation,
  }));

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
      <FormProvider {...profileFormMethods}>
        <div className="flex flex-row items-center gap-4">
          <ProfileIcon color="light" size={56} />
          <div className="flex flex-col">
            <header className="text-good-dog-main text-xl font-semibold">
              {user?.firstName + " " + user?.lastName}
            </header>
            <div className="text-dark-gray-200">
              {user ? getRoleLabel(user.role) : "Undefined"} | Since{" "}
              {userCreatedAtFormatted}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-[16px]">
          <div className="rounded-2xl bg-white border">
            <header className="flex justify-between items-center bg-gray-200 rounded-t-2xl py-2.5 px-[24px]">
              <p className="text-lg font-medium text-good-dog-main">
                Personal details
              </p>

              {editingPersonalDetails ? (
                <div className="flex flex-row gap-2">
                  <Button
                    size="small"
                    variant="contained"
                    label="Save"
                    onClick={handleChangeProfileValues}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    label="Cancel"
                    onClick={() => setEditingPersonalDetails(false)}
                  />
                </div>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  displayIcon="pencil"
                  label="Edit"
                  onClick={() => setEditingPersonalDetails(true)}
                />
              )}
            </header>
            <div className="flex flex-col gap-y-[16px] rounded-2xl p-[24px] pt-[16px]">
              {editingPersonalDetails ? (
                <>
                  <div className="flex flex-row gap-16">
                    <div className="flex-1">
                      <RHFTextInput<ProfileValuesFields>
                        rhfName={"firstName"}
                        label={"First name"}
                        placeholder={""}
                        id={"firstName"}
                        clearIcon
                      />
                    </div>
                    <div className="flex-1">
                      <RHFTextInput<ProfileValuesFields>
                        rhfName={"lastName"}
                        label={"Last Name"}
                        placeholder={""}
                        id={"lastName"}
                        clearIcon
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-16">
                    <div className="flex-1">
                      <RHFDropdown<ProfileValuesFields>
                        rhfName={"affiliation"}
                        label={"Group"}
                        placeholder={""}
                        options={affiliations}
                        arrow={true}
                        id={"affiliation"}
                      />
                    </div>
                    <div className="flex-1">
                      <RHFTextInput<ProfileValuesFields>
                        rhfName={"ipi"}
                        label={"IPI No."}
                        placeholder={""}
                        id={"ipi"}
                        clearIcon
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-row ">
                    <div className="w-[380px]">
                      <InfoField
                        header="First name"
                        content={user ? user.firstName : ""}
                      />
                    </div>
                    <InfoField
                      header="Last name"
                      content={user ? user.lastName : ""}
                    />
                  </div>
                  <div className="flex flex-row ">
                    <div className="w-[380px]">
                      <InfoField
                        header="Group"
                        content={user?.affiliation ? user.affiliation : "NONE"}
                      />
                    </div>
                    <InfoField
                      header="IPI No."
                      content={user?.ipi ? user.ipi : "NONE"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white border">
            <header className="text-lg font-medium text-good-dog-main bg-gray-200 rounded-t-2xl py-2.5 px-[24px]">
              Security
            </header>
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
          </div>

          <div className="rounded-2xl bg-white border">
            <header className="rounded-t-2xl bg-white pt-2.5 px-[23.5px] text-error font-medium text-lg">
              Delete account
            </header>
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
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
