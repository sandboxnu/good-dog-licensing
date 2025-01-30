import { mock } from "bun:test";

import { EmailService } from "@good-dog/email";

// A mock for the email-service functions in the email-service module.
export class MockEmailService extends EmailService {
  clear() {
    this.send.mockClear();
    this.generateSixDigitCode.mockClear();
  }

  readonly send = mock<EmailService["send"]>();

  readonly generateSixDigitCode = mock<() => string>().mockImplementation(
    () => {
      return "123456";
    },
  );
}
