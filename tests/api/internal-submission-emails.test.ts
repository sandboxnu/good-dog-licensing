import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { EmailParams, Recipient, Sender } from "mailersend";

import { prisma } from "@good-dog/db";
import { env } from "@good-dog/env";

import { MockEmailService } from "../mocks/MockEmailService";

describe("internal email notifications", () => {
  const mockEmail = new MockEmailService();

  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        {
          email: "admin1@test.com",
          phoneNumber: "1234567890",
          hashedPassword: "",
          firstName: "first",
          lastName: "last",
          role: "ADMIN",
          userId: "1",
        },
        {
          email: "mod1@test.com",
          phoneNumber: "1234567890",
          hashedPassword: "",
          firstName: "first",
          lastName: "last",
          role: "MODERATOR",
          userId: "2",
        },
      ],
    });
    mockEmail.clear();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: ["admin1@test.com", "mod1@test.com"] } },
    });
    mockEmail.clear();
  });

  const getBaseUrl = () => {
    let baseURL = "http://localhost:3000";
    if (env.VERCEL_URL) {
      baseURL = `https://${env.VERCEL_URL}`;
    }

    return baseURL;
  };

  test("notifyInternalUsersNewMusicSubmitted calls send with correct recipients and content", async () => {
    await mockEmail.notifyInternalUsersNewMusicSubmitted("music123");

    const emailParams = new EmailParams()
      .setFrom(new Sender(env.GOOD_DOG_FROM_EMAIL ?? "", "Good Dog Licensing"))
      .setTo([new Recipient("admin1@test.com"), new Recipient("mod1@test.com")])
      .setReplyTo(
        new Sender(env.GOOD_DOG_FROM_EMAIL ?? "", "Good Dog Licensing"),
      )
      .setSubject("New Music Submission - Good Dog Licensing")
      .setHtml(
        `<p>A new music submission has been made. Review it <a href="${getBaseUrl()}/dashboard/songs/?id=music123">here</a>.</p>`,
      );

    expect(mockEmail.send).toHaveBeenCalledWith(emailParams);
  });

  test("notifyInternalUsersNewProjectsSubmitted calls send with correct recipients and content", async () => {
    await mockEmail.notifyInternalUsersNewProjectSubmitted("project123");

    const emailParams = new EmailParams()
      .setFrom(new Sender(env.GOOD_DOG_FROM_EMAIL ?? "", "Good Dog Licensing"))
      .setTo([new Recipient("admin1@test.com"), new Recipient("mod1@test.com")])
      .setReplyTo(
        new Sender(env.GOOD_DOG_FROM_EMAIL ?? "", "Good Dog Licensing"),
      )
      .setSubject("New Project Submission - Good Dog Licensing")
      .setHtml(
        `<p>A new project submission has been made. Review it <a href="${getBaseUrl()}/dashboard/projects/?id=project123">here</a>.</p>`,
      );

    expect(mockEmail.send).toHaveBeenCalledWith(emailParams);
  });
});
