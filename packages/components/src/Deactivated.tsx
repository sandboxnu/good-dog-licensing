"use client";

import Button from "@good-dog/components/base/Button";
import PhoneMaintenance from "./svg/PhoneMaintenance";

const CONTACT_EMAIL = "example@email.com";

export default function Deactivated() {
  return (
    <div className="relative flex w-full flex-col items-center rounded-[16px] border-[0.5px] border-solid border-gray-600 bg-cream-300 p-[48px] dark:border-gray-200 dark:bg-green-600">
      <PhoneMaintenance />
      <h3 className="mt-[24px] text-center text-[35px] text-green-400 dark:text-mint-200">
        Account inactive
      </h3>
      <div className="mt-[8px] text-center text-[16px] text-dark-gray-500 dark:text-gray-300">
        Your account has been deactivated, please email
      </div>
      <div className="text-center text-[16px] text-dark-gray-500 dark:text-gray-300">
        Good Dog Licensing at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-green-500 dark:text-mint-200 underline"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        to reactivate it
      </div>
      <div className="mt-[24px]">
        <Button
          label="Send email"
          size="large"
          onClick={() => (window.location.href = `mailto:${CONTACT_EMAIL}`)}
          variant="contained"
          shadow
        />
      </div>
    </div>
  );
}
