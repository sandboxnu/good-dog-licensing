"use client";

import ResetPassword from "../../../svg/onboarding/ResetPassword";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-1/2 flex-row items-center">
          <div className="flex w-full flex-col gap-[32px]">
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
