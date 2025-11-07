"use client";
import ForgotPasswordForm from "./ForgotPasswordForm";
import UserOnboardingWidgetContainer from "../UserOnboardingWidgetContainer";
import ForgotPassword from "../../../svg/onboarding/ForgotPassword";

export default function ForgotPasswordWidget() {
  return (
    <UserOnboardingWidgetContainer>
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-row items-center w-1/2">
          <div className="flex flex-col gap-[32px] w-full">
            <div className="flex flex-col gap-[8px]">
              <h3>Forgot password?</h3>
              <p>No worries! Enter your account email address to reset. </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
        <ForgotPassword />
      </div>
    </UserOnboardingWidgetContainer>
  );
}
