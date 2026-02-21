import { emailLayout } from "../layout";
import { buttonCard } from "../components";

export function passwordResetTemplate(options: { resetLink: string }) {
  const { resetLink } = options;

  const content = `
    <p>Hi <strong>User</strong>,</p>

    <p>
      We received a request to reset your password for your Good Dog Licensing account.
    </p>

    ${buttonCard({
      text: "Click the button below to create a new password:",
      buttonText: "Reset my password",
      buttonHref: resetLink,
    })}

    <p>
      If you didn't request a password reset, please ignore this email —
      your account will remain secure.
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Action needed: Password reset request",
    content,
  });
}
