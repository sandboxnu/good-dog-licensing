import PageContainer from "@good-dog/components/PageContainer";
import AccountDeactivated from "@good-dog/components/user-onboarding/widgets/account-deactivated-widget/AccountDeactivated";

export default function Page() {
  return (
    <PageContainer background="gradient" widthType="small">
      <AccountDeactivated />
    </PageContainer>
  );
}
