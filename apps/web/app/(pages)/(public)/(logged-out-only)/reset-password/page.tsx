import PageContainer from "@good-dog/components/PageContainer";
import UserOnboarding from "@good-dog/components/user-onboarding/UserOnboarding";

export default function Page() {
  return (
    <PageContainer background="gradient" widthType="capped">
      <UserOnboarding type="RESET_PASSWORD" initialRole={undefined} />
    </PageContainer>
  );
}
