import React from "react";

import GeneralLanding from "@good-dog/components/landing-pages/general/GeneralLanding";
import PageContainer from "@good-dog/components/PageContainer";

export default async function Home() {
  return (
    <PageContainer
      background="gradient"
      widthType="full"
      allowMobile={true}
      smallHeader={true}
    >
      <GeneralLanding />
    </PageContainer>
  );
}
