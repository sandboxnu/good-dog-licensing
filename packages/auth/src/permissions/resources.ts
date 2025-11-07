import { Role } from "@good-dog/db";

import { GoodDogPermissionsFactory } from "./factory";

const superUserPermissions = new GoodDogPermissionsFactory({
  read: [Role.ADMIN],
  modify: [Role.ADMIN],
  submit: [Role.ADMIN],
});

export const publicPagePermissions = new GoodDogPermissionsFactory({
  read: true,
  modify: [Role.ADMIN],
  submit: [Role.ADMIN],
});

export const adminPagePermissions = superUserPermissions;

export const projectAndRepertoirePagePermissions = adminPagePermissions.extend({
  read: [Role.MODERATOR, Role.MUSICIAN],
  modify: [Role.MODERATOR, Role.MUSICIAN],
  submit: [Role.MODERATOR, Role.MUSICIAN],
});

export const mediaMakerOnlyPermissions =
  projectAndRepertoirePagePermissions.extend({
    read: [Role.MEDIA_MAKER],
    modify: [],
    submit: [Role.MEDIA_MAKER],
  });

export const musicianOnlyPermissions =
  projectAndRepertoirePagePermissions.extend({
    read: [Role.MUSICIAN],
    modify: [],
    submit: [Role.MUSICIAN],
  });
