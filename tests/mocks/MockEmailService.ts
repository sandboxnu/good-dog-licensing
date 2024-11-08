import { mock } from "bun:test";

import type { EmailMessage } from "@good-dog/email/email-service";

// A mock for the email-service functions in the email-service module.
export class MockEmailService {
  // Applies this mock to be the email-service functions used by the email-service module. This method
  // must be called in order for this mock to be applied.
  async apply(): Promise<void> {
    await mock.module("@good-dog/email/email-service", () => ({
      setApiKey: this.setApiKey,
      send: this.send,
      generateSixDigitCode: this.generateSixDigitCode,
    }));
  }

  // Clears the mock functions
  clear() {
    this.setApiKey.mockClear();
    this.send.mockClear();
    this.generateSixDigitCode.mockClear();
  }

  readonly setApiKey = mock<(apiKey: string) => void>();

  readonly send =
    mock<(msg: EmailMessage, fromEmail?: string) => Promise<void>>();

  readonly generateSixDigitCode = mock<() => string>().mockImplementation(
    () => {
      return "123456";
    },
  );
}
