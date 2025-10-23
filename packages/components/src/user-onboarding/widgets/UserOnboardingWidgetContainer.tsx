interface UserOnboardingWidgetContainerProps {
  children: React.ReactNode;
}

export default function UserOnboardingWidgetContainer({
  children,
}: UserOnboardingWidgetContainerProps) {
  return (
    <div className="flex h-[584px] w-full flex-row rounded-[16px] border border-solid border-black bg-[#FFFBF6] p-[48px]">
      {children}
    </div>
  );
}
