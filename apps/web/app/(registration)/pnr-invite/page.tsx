import { Suspense } from "react";

import ModeratorOnboarding from "@good-dog/components/registration/onboarding/ModeratorOnboarding";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ModeratorOnboarding />
    </Suspense>
  );
}
