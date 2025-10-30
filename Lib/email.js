const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = (() => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
})();

async function sendEmail({ to, subject, html, text, from }) {
  from = from || process.env.EMAIL_FROM || "the1officialkwesi@gmail.com";

  if (!transporter) {
    console.log("Email not sent (no SMTP configured). Payload:");
    console.log({ from, to, subject, text, html });
    return { accepted: [to], message: "logged-only" };
  }

  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}

module.exports = { sendEmail };
