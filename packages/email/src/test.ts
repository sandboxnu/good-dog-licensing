import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const sendGridAPIKey = process.env.SENDGRID_API_KEY;

if (sendGridAPIKey === undefined) {
  console.log("Here");
} else {
  sgMail.setApiKey(sendGridAPIKey);
  const msg = {
    to: "jordanpraissman@gmail.com", // Change to your recipient
    from: "jordanpraissman@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
