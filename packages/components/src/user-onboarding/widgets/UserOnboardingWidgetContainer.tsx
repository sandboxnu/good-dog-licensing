import React from "react";

interface UserOnboardingWidgetContainerProps {
  children: React.ReactNode;
}

export default function ({ children }: UserOnboardingWidgetContainerProps) {
  return (
    <div className="relative flex h-[584px] w-full flex-row rounded-[16px] border border-solid border-gray-600 dark:border-gray-200 bg-cream-300 dark:bg-green-600 p-[48px]">
      {children}
    </div>
  );
}
