const nodemailer = require("nodemailer");

let mailTransport = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const SMTP_FROM = process.env.SMTP_FROM || "Admin Auth <no-reply@example.com>";

async function sendOtpEmail(to, otp) {
  const text = `Your OTP is ${otp}. It expires in ${
    process.env.OTP_EXP_MINUTES || 10
  } minutes.`;
  if (!mailTransport) {
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    return;
  }
  await mailTransport.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Password Reset OTP",
    text,
  });
}

module.exports = { sendOtpEmail };
