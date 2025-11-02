import React from "react";

interface UserOnboardingWidgetContainerProps {
  children: React.ReactNode;
}

export default function UserOnboardingWidgetContainer({
  children,
}: UserOnboardingWidgetContainerProps) {
  return (
    <div className="relative rounded-[16px] bg-[#FFFBF6] border-black border border-solid h-[584px] p-[48px] w-full flex flex-row">
      {children}
    </div>
  );
}
