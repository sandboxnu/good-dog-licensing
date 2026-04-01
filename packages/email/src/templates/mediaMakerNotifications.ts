import { emailLayout } from "../layout";
import { buttonCard } from "../components";

export function mediaMakerJoiningConfirmationTemplate() {
  const content = `
    <p>Hi,</p>

    <p>
      Hello and welcome to Good Dog! Thank you for signing up — we're excited to help you find the perfect music for your projects.
    </p>

    <p>
      When you're ready, submit a brief and our team will match you with a project manager who will guide you through the entire process.
    </p>

    <p>Thank you for joining Good Dog!</p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Welcome to Good Dog!",
    content,
  });
}

export function mediaMakerBriefSubmissionConfirmationTemplate() {
  const content = `
    <p>Hi,</p>

    <p>
      Hello and thank you for choosing to work with Good Dog! Your brief has been submitted and is being reviewed by our Good Dog representatives.
    </p>

    <p>
      You will be matched with a project manager shortly that will work with you to find the perfect music for your project.
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Brief Submitted — Thank You!",
    content,
  });
}

export function mediaMakerProjectManagerAssignedTemplate(options: {
  projectName: string;
  projectManagerName: string;
}) {
  const { projectName, projectManagerName } = options;

  const content = `
    <p>Hi,</p>

    <p>
      You have been matched with a project manager! Your brief for <strong>${projectName}</strong> has been assigned to <strong>${projectManagerName}</strong>.
    </p>

    <p>
      They will be your point person for this entire process — feel free to reach out to them with any questions you may have. You'll be hearing from them shortly!
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Project Manager Assigned",
    content,
  });
}

export function mediaMakerChatMessageTemplate(options: {
  projectName: string;
  link: string;
}) {
  const { projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      There is a new message in the chat for <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to view the message.",
      buttonText: "View Chat",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "New Chat Message",
    content,
  });
}

export function mediaMakerSongSuggestionByPMTemplate(options: {
  songName: string;
  projectName: string;
  link: string;
}) {
  const { songName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A song suggestion has been sent by your Project Manager!
      <strong>${songName}</strong> has been suggested as a match for your project <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to review the song and sign the licensing agreement.",
      buttonText: "Review Song Information",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Song Suggestion from Your Project Manager",
    content,
  });
}

export function mediaMakerLicenseCompleteTemplate(options: {
  songName: string;
  projectName: string;
  link: string;
}) {
  const { songName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Congratulations! Your project to license <strong>${songName}</strong> in <strong>${projectName}</strong> has been signed by both parties and is now complete!
    </p>

    <p>Thank you for working with Good Dog Licensing!</p>

    ${buttonCard({
      text: "Click below to view the contract.",
      buttonText: "View contract",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "License Complete — Congratulations!",
    content,
  });
}

export function mediaMakerMaterialRequestTemplate(options: { link: string }) {
  const { link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Now that you have licensed music, we need some materials to advertise your project.
    </p>

    ${buttonCard({
      text: "Please click below to upload a thumbnail and a link to your project.",
      buttonText: "Upload Materials",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Materials Needed for Your Project",
    content,
  });
}
