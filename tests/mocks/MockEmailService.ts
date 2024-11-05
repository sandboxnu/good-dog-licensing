import { mock } from "bun:test";

// A mock for the cookies function in the NextJS next/header module.
export class MockEmailService {
  private haveSendError: boolean;

  constructor() {
    this.haveSendError = false;
  }

  setSendError(error: boolean) {
    this.haveSendError = error;
  }

  // Applies this mock to be the cookies used by the next/header module. This method
  // must be called in order for this mock to be applied.
  async apply(): Promise<void> {
    await mock.module("@good-dog/email/email-service", () => ({
      default: {
        setApiKey: () => {
          console.log("Mock setting api key.");
        },
        send: () => {
          console.log("Mock email send.");
          return !this.haveSendError;
        },
      },
    }));
  }
}
