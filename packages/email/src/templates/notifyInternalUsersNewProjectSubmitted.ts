import { emailLayout } from "../layout";

export function notifyInternalUsersNewProjectSubmittedTemplate(options: {
  link: string;
}) {
  const { link } = options;

  const content = `
    <p>Hi,</p>

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
    title: "New Project Submission",
    content,
  });
}
