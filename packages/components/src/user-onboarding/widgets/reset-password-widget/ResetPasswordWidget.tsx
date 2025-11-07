"use client";

import ResetPassword from "../../../svg/onboarding/ResetPassword";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex flex-row w-full items-center ">
        <div className="flex flex-row items-center w-1/2">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[8px]">
              <h3>Reset password</h3>
              <p>Enter your details in the required fields below</p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
        <ResetPassword />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
