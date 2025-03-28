import { onboardingPagePermissions } from "@good-dog/auth/permissions";
import { layoutWithPermissions } from "@good-dog/components/PermissionsLayoutWrapper";

export const dynamic = "force-dynamic";

export default layoutWithPermissions(onboardingPagePermissions);
