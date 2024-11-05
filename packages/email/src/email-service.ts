import sgMail from "@sendgrid/mail";

// These functions are an abstraction over the sgMail module from sendgrid. The main
// purpose is to throw runtime errors for blank api keys/from emails so we are alerted of
// the issue ahead of time.

function setApiKey(apiKey: string) {
  if (apiKey == "") {
    throw new TypeError("Invalid api key: Expected a non-empty string.");
  }

  sgMail.setApiKey(apiKey);
}

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  html: string;
}

async function send(msg: EmailMessage): Promise<boolean> {
  if (msg.from == "") {
    throw new TypeError("Invalid from email: Expected a non-empty string.");
  }

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {
  setApiKey,
  send,
};
