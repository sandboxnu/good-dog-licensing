import React from "react";

interface UserOnboardingWidgetContainerProps {
  children: React.ReactNode;
}

export default function ({ children }: UserOnboardingWidgetContainerProps) {
  return (
    <div className="relative flex w-full flex-row rounded-[16px] border border-solid border-gray-600 bg-cream-300 p-[48px] dark:border-gray-200 dark:bg-green-600">
      {children}
    </div>
  );
}
