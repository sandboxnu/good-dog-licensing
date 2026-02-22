import { emailLayout } from "../layout";

export function emailVerificationTemplate(options: { code: string }) {
  const { code } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Your Verification Code: <strong>${code}</strong>
    </p>

    <p>
      If you didn't request a verification code, please ignore this email
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Email Verification Code",
    content,
  });
}
