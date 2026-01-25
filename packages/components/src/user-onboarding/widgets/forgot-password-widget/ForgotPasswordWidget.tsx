"use client";

import ForgotPassword from "../../../svg/onboarding/ForgotPassword";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-1/2 flex-row items-center">
          <div className="flex w-full flex-col gap-[32px]">
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-green-400 dark:text-mint-200">
                Forgot password?
              </h3>
              <p className="text-dark-gray-500 dark:text-gray-200">
                No worries! Enter your account email address to reset.{" "}
              </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
        <ForgotPassword />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
