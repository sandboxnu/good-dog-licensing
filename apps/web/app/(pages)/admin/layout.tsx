import { adminPagePermissions } from "@good-dog/auth/permissions";
import { layoutWithPermissions } from "@good-dog/components/PermissionsLayoutWrapper";

export default layoutWithPermissions(adminPagePermissions);
