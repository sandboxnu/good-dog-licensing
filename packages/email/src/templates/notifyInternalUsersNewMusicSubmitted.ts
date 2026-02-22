import { emailLayout } from "../layout";

export function notifyInternalUsersNewMusicSubmittedTemplate(options: {
  link: string;
  firstName: string;
}) {
  const { link, firstName } = options;

  const content = `
    <p>Hi <strong>${firstName}</strong>,</p>

    <p>
      A new music submission has been made. Review it <a href="${link}">here</a>.
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "New Music Submission",
    content,
  });
}
