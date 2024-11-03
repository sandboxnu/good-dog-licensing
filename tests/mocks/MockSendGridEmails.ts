import { mock } from "bun:test";

// A mock for the cookies function in the NextJS next/header module.
export class MockSendGridEmails {
  // Applies this mock to be the cookies used by the next/header module. This method
  // must be called in order for this mock to be applied.
  async apply(): Promise<void> {
    await mock.module("@sendgrid/mail", () => ({
      default: {
        setApiKey: () => {
          console.log("setting");
        },
        send: () => {
          console.log("sending");
        },
      },
    }));
  }
}
