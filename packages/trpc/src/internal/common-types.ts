import type { Role } from "@good-dog/db";

export interface UserWithSession {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  session: {
    expiresAt: Date;
    refreshRequired: boolean;
  };
}
