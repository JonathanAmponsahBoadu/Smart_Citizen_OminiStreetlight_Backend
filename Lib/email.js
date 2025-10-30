const nodemailer = require("nodemailer");
require("dotenv").config();

// Prefer SendGrid (HTTP API) on PaaS where SMTP outbound may be blocked.
let sgMail = null;
if (process.env.SENDGRID_API_KEY) {
  try {
    // require lazily so module is optional
    sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } catch (e) {
    console.warn(
      "SENDGRID_API_KEY is set but @sendgrid/mail is not installed. Falling back to SMTP or console logging."
    );
    sgMail = null;
  }
}

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

  return null; // fallback: log to console
})();

async function sendEmail({ to, subject, html, text, from }) {
  from = from || process.env.EMAIL_FROM || "the1officialkwesi@gmail.com";

  // 1) If SendGrid is configured and available, use it (works over HTTPS)
  if (sgMail) {
    const msg = {
      to,
      from,
      subject,
      text,
      html,
    };
    // @sendgrid/mail returns an array of responses for multiple recipients
    const res = await sgMail.send(msg);
    return res;
  }

  // 2) Fallback to SMTP transporter if configured
  if (transporter) {
    const info = await transporter.sendMail({ from, to, subject, text, html });
    return info;
  }

  // 3) Local dev fallback: log and return a fake response
  console.log("Email not sent (no provider configured). Payload:");
  console.log({ from, to, subject, text, html });
  return { accepted: [to], message: "logged-only" };
}

module.exports = { sendEmail };
