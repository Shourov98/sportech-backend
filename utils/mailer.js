// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // use true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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

module.exports = sendMail;
