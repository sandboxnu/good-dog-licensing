import { emailLayout } from "../layout";
import { buttonCard } from "../components";

export function adminAndPNRBriefAvailableTemplate(options: {
  mediaMakerName: string;
  songCount: number;
  projectName: string;
  link: string;
}) {
  const { mediaMakerName, songCount, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A new brief has been submitted and is ready to be assigned a project manager.
      <strong>${mediaMakerName}</strong> wants <strong>${songCount}</strong> song${songCount !== 1 ? "s" : ""} for their project <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to view more details of the brief and assign a Good Dog representative.",
      buttonText: "View Brief",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "New Brief Available",
    content,
  });
}

export function adminProjectManagerAssignedTemplate(options: {
  adminName: string;
  pmName: string;
  projectName: string;
  link: string;
}) {
  const { adminName, pmName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A project manager has been assigned to a brief by <strong>${adminName}</strong>.
      <strong>${pmName}</strong> is now the project manager for <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to learn more about the brief and make song suggestions.",
      buttonText: "View Brief",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Project Manager Assigned to Brief",
    content,
  });
}

export function adminAndPMChatMessageTemplate(options: {
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

export function adminSongSuggestionSentToMMTemplate(options: {
  senderName: string;
  songName: string;
  artistName: string;
  projectName: string;
  link: string;
}) {
  const { senderName, songName, artistName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A song suggestion has been sent to the Media Maker by the Project Manager.
      <strong>${senderName}</strong> has sent <strong>${songName}</strong> by <strong>${artistName}</strong> for the project <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to view the song request.",
      buttonText: "View Song Request",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Song Suggestion Sent to Media Maker",
    content,
  });
}

export function adminAndPMSongSuggestionApprovedByMMTemplate(options: {
  mediaMakerName: string;
  songName: string;
  artistName: string;
  projectName: string;
  link: string;
}) {
  const { mediaMakerName, songName, artistName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Congratulations! The media maker has approved a song suggestion and is ready to license.
      <strong>${mediaMakerName}</strong> has approved <strong>${songName}</strong> by <strong>${artistName}</strong> for their project <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to view the song request.",
      buttonText: "View Song Request",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Song Suggestion Approved by Media Maker",
    content,
  });
}

export function adminAndPMLicenseSignedTemplate(options: {
  mediaMakerName: string;
  musicianName: string;
  projectName: string;
  link: string;
}) {
  const { mediaMakerName, musicianName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Congratulations! A license has been signed by both parties and the brief is now complete.
      <strong>${mediaMakerName}</strong> and <strong>${musicianName}</strong> have both signed the license for <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to view the final contract.",
      buttonText: "View Contract",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "License Signed — Brief Complete",
    content,
  });
}

export function adminAndPMMaterialsDeliveredTemplate(options: {
  mediaMakerName: string;
  projectName: string;
}) {
  const { mediaMakerName, projectName } = options;

  const content = `
    <p>Hi,</p>

    <p>
      All materials have been delivered for the brief.
      Links and thumbnails have been uploaded by <strong>${mediaMakerName}</strong> for <strong>${projectName}</strong>.
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Materials Delivered",
    content,
  });
}

export function pmSongSuggestionAddedToBriefTemplate(options: {
  prName: string;
  songName: string;
  artistName: string;
  projectName: string;
  link: string;
}) {
  const { prName, songName, artistName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A new song has been suggested for your brief.
      <strong>${prName}</strong> has suggested <strong>${songName}</strong> by <strong>${artistName}</strong> for <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: "Click below to review the suggestion.",
      buttonText: "View Song Request",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Song Suggestion Added to Brief",
    content,
  });
}
