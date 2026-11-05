"use client";

import ForgotPassword from "../../../svg/onboarding/ForgotPassword";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-full flex-row items-center md:w-1/2">
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
            <div className="flex justify-center">
              <p className="text-black dark:text-white">
                Back to{" "}
                <span className="underline">
                  <a href="/login">Login</a>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <ForgotPassword />
        </div>
      </div>
    </UserOnboardingWidgetContainer>
  );
}
