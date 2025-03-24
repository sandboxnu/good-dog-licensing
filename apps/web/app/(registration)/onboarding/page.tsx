import { onboardingPagePermissions } from "@good-dog/auth/permissions";
import { withPermissions } from "@good-dog/components/PermissionsWrapper";
import { OnboardingForm } from "@good-dog/components/registration";

// Necessary to access cookies
export const dynamic = "force-dynamic";

export default withPermissions(onboardingPagePermissions, OnboardingForm);
