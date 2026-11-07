import { buttonCard } from "../components";
import { emailLayout } from "../layout";

export function artistJoiningConfirmationTemplate() {
  const content = `
    <p>Hi,</p>

    <p>
      Hello and welcome to Good Dog! Thank you for joining our platform to add yourself to our diverse and growing catalog of independent musicians.
    </p>

    <p>
      Any music you choose to submit will be automatically pitched to applicable briefs by our Good Dog representatives. You will be notified when a Media Maker wants to use your music.
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

export function artistMusicSubmissionConfirmationTemplate() {
  const content = `
    <p>Hi,</p>

    <p>
      Thank you for submitting your music to Good Dog Licensing! Your submission has been received and is being reviewed by our team.
    </p>

    <p>
      We'll be in touch if your music is a match for one of our briefs. Keep an eye on your inbox!
    </p>

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Music Submitted — Thank You!",
    content,
  });
}

export function artistSongRequestedForBriefTemplate(options: {
  songName: string;
  projectName: string;
  link: string;
}) {
  const { songName, projectName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      Congratulations! A media maker has requested to use your song <strong>${songName}</strong> for their project <strong>${projectName}</strong>.
    </p>

    ${buttonCard({
      text: 'Click below to learn more about the project so you can say "YES" to Licensing!',
      buttonText: "View Project Information",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Song Requested for a Brief",
    content,
  });
}

export function artistLicenseCompleteTemplate(options: {
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

export function artistSongPostedForReviewTemplate(options: {
  songName: string;
  link: string;
}) {
  const { songName, link } = options;

  const content = `
    <p>Hi,</p>

    <p>
      A member of the Good Dog Licensing team has added your song <strong>${songName}</strong> to Good Dog on your behalf.
    </p>

    <p>
      Before it can be pitched to briefs, please review the song information, make any edits needed, and approve it. If you don't want this song on Good Dog, you can decline it.
    </p>

    ${buttonCard({
      text: "Click below to review your song.",
      buttonText: "Review Song",
      buttonHref: link,
    })}

    <p style="margin-top:32px;">
      <strong>Thank you,</strong><br/>
      The Good Dog Licensing Team<br />
      <a href="gooddoglicensing.com">gooddoglicensing.com</a>
    </p>
  `;

  return emailLayout({
    title: "Review Your Song Submission",
    content,
  });
}
