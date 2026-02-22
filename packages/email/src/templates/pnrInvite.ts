import { emailLayout } from "../layout";

export function pnrInviteTemplate(options: {
  inviteLink: string;
  firstName: string;
}) {
  const { inviteLink, firstName } = options;

  const content = `
    <p>Hi <strong>${firstName}</strong>,</p>

    <p>
      Follow <a href="${inviteLink}">this link</a> to sign up as a PR.
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "P&R Invite Request",
    content,
  });
}
