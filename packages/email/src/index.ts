import { env } from "@good-dog/env";

import { EmailService } from "./service";

export const emailService = new EmailService(env.RESEND_API_KEY);

export type { EmailMessage } from "./service";
export { EmailService } from "./service";
