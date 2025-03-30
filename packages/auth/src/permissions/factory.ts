import type { Role } from "@good-dog/db";

// Either 'true', meaning all roles have permission, or an array of roles that have permission
type PermissionRule<R extends Role> = true | R[];

interface PermissionRules<R extends Role, M extends Role, S extends Role> {
  read: PermissionRule<R>;
  modify: PermissionRule<M>;
  submit: PermissionRule<S>;
}

export class GoodDogPermissionsFactory<
  Read extends Role,
  Modify extends Role,
  Submit extends Role,
> {
  readonly rules: PermissionRules<Read, Modify, Submit>;

  constructor(rules: PermissionRules<Read, Modify, Submit>) {
    this.rules = rules;
  }

  canRead(role?: Role) {
    return this.rules.read === true || this.rules.read.includes(role as Read);
  }

  canModify(role?: Role) {
    return (
      this.rules.modify === true || this.rules.modify.includes(role as Modify)
    );
  }

  canSubmit(role?: Role) {
    return (
      this.rules.submit === true || this.rules.submit.includes(role as Submit)
    );
  }

  extend<
    NewRead extends Role,
    NewModify extends Role,
    NewSubmit extends Role,
  >(rules: { read: NewRead[]; modify: NewModify[]; submit: NewSubmit[] }) {
    if (
      this.rules.read === true ||
      this.rules.modify === true ||
      this.rules.submit === true
    ) {
      throw new Error("Cannot extend role with a universal permission");
    }

    return new GoodDogPermissionsFactory({
      read: [...this.rules.read, ...rules.read],
      modify: [...this.rules.modify, ...rules.modify],
      submit: [...this.rules.submit, ...rules.submit],
    });
  }
}
