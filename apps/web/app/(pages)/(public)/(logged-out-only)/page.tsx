import React from "react";

import GeneralLanding from "@good-dog/components/landing-pages/GeneralLanding";
import PageContainer from "@good-dog/components/PageContainer";

export default async function Home() {
  return (
    <PageContainer background="solid">
      <GeneralLanding />
    </PageContainer>
  );
}
