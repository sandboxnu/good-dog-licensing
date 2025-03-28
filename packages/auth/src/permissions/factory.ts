import type { Role } from "@good-dog/db";

// Either 'true', meaning all roles have permission, or an array of roles that have permission
type PermissionRule<R extends Role> = true | R[];

interface PermissionRules<R extends Role, W extends Role> {
  read: PermissionRule<R>;
  write: PermissionRule<W>;
}

export class GoodDogPermissionsFactory<Read extends Role, Write extends Role> {
  readonly rules: PermissionRules<Read, Write>;

  constructor(rules: PermissionRules<Read, Write>) {
    this.rules = rules;
  }

  canRead(role?: Role) {
    return this.rules.read === true || this.rules.read.includes(role as Read);
  }

  canWrite(role?: Role) {
    return (
      this.rules.write === true || this.rules.write.includes(role as Write)
    );
  }

  extend<NewRead extends Role, NewWrite extends Role>(rules: {
    read: NewRead[];
    write: NewWrite[];
  }) {
    if (this.rules.read === true || this.rules.write === true) {
      throw new Error(
        "Cannot extend role with universal read/write permissions",
      );
    }

    return new GoodDogPermissionsFactory({
      read: [...this.rules.read, ...rules.read],
      write: [...this.rules.write, ...rules.write],
    });
  }
}
