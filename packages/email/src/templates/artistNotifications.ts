import { emailLayout } from "../layout";
import { buttonCard } from "../components";

export function artistJoiningConfirmationTemplate() {
  const content = `
    <p>Hi,</p>

    <p>
      Hello and welcome to Good Dog! Thank you for submitting your music to be in our diverse and growing catalog of independent musicians.
    </p>

    <p>
      Your music will now be pitched to applicable briefs by our Good Dog representatives. You will be notified when a Media Maker wants to use your music.
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
      buttonText: "View Project",
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
      text: "Click below to finalize the project.",
      buttonText: "Finalize Project",
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
