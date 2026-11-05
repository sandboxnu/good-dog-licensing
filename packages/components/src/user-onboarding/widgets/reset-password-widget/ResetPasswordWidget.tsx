"use client";

import ResetPassword from "../../../svg/onboarding/ResetPassword";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-row items-center md:w-1/2">
          <div className="flex w-full flex-col gap-[32px]">
            <div className="flex flex-col gap-[8px]">
              <h3>Reset password</h3>
              <p>Enter your details in the required fields below</p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
        <div className="hidden md:block md:w-1/2">
          <ResetPassword />
        </div>
      </div>
    </UserOnboardingWidgetContainer>
  );
}
