import { env } from "@good-dog/env";

import { EmailService } from "./internal";

export const emailService = new EmailService(env.SENDGRID_API_KEY);

export type { EmailMessage } from "./internal";
export { EmailService } from "./internal";
