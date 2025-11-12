import React from "react";

interface UserOnboardingWidgetContainerProps {
  children: React.ReactNode;
}

export default function UserOnboardingWidgetContainer({
  children,
}: UserOnboardingWidgetContainerProps) {
  return (
    <div className="relative flex h-[584px] w-full flex-row rounded-[16px] border border-solid border-black bg-[#FFFBF6] p-[48px]">
      {children}
    </div>
  );
}
