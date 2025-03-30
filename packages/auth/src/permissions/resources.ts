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

export const projectAndRepertoirePagePermissions = adminPagePermissions.extend({
  read: [Role.MODERATOR],
  write: [Role.MODERATOR],
});

export const onboardingPagePermissions = superUserPermissions.extend({
  read: [Role.ONBOARDING],
  write: [Role.ONBOARDING],
});

export const mediaMakerOnlyPermissions =
  projectAndRepertoirePagePermissions.extend({
    read: [Role.MEDIA_MAKER],
    write: [Role.MEDIA_MAKER],
  });

export const musicianOnlyPermissions =
  projectAndRepertoirePagePermissions.extend({
    read: [Role.MUSICIAN],
    write: [Role.MUSICIAN],
  });
