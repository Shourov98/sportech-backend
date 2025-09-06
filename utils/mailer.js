// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""), // strip spaces if Gmail app password
  },
});

async function sendMail(to, subject, html) {
  return transporter.sendMail({
    from: `"Website Contact" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendMail; // <-- default export (a function)
