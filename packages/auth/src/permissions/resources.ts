import { Role } from "@good-dog/db";

import { GoodDogPermissionsFactory } from "./factory";

const superUserPermissions = new GoodDogPermissionsFactory({
  read: [Role.ADMIN],
  write: [Role.ADMIN],
});

export const publicPagePermissions = new GoodDogPermissionsFactory({
  read: true,
  write: [Role.ADMIN],
});

export const adminPagePermissions = superUserPermissions;

export const projectAndRepetoirePagePermissions = adminPagePermissions.extend({
  read: [Role.MODERATOR],
  write: [Role.MODERATOR],
});

export const onboardingPagePermissions = superUserPermissions.extend({
  read: [Role.ONBOARDING],
  write: [Role.ONBOARDING],
});
