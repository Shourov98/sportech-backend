const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const { signJwt, setAuthCookie, clearAuthCookie } = require("../utils/jwt");
const { sendOtpEmail } = require("../utils/email");
const { gen4DigitOtp, addMinutes } = require("../utils/otp");

const ADMIN_SEED_SECRET = process.env.ADMIN_SEED_SECRET || "";
const OTP_EXP_MINUTES = parseInt(process.env.OTP_EXP_MINUTES || "10", 10);

// Seed Admin
exports.seedAdmin = async (req, res) => {
  try {
    const { email, password, seedSecret } = req.body;
    if (!email || !password || seedSecret !== ADMIN_SEED_SECRET) {
      return res.status(400).json({ error: "Invalid seed request" });
    }

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Admin already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ email, passwordHash });

    res.status(201).json({ admin: admin.toJSONSafe() });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt({
    sub: admin._id,
    email: admin.email,
    tv: admin.tokenVersion,
  });
  setAuthCookie(res, token);
  res.json({ admin: admin.toJSONSafe(), token });
};

// Logout
exports.logout = (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.json({ message: "If email exists, OTP sent" });

  const otp = gen4DigitOtp();
  admin.resetOtp = otp;
  admin.resetOtpExpiresAt = addMinutes(new Date(), OTP_EXP_MINUTES);
  admin.resetSessionToken = undefined;
  await admin.save();

  await sendOtpEmail(admin.email, otp);
  res.json({ message: "If email exists, OTP sent" });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({ email });
  if (
    !admin ||
    admin.resetOtp !== otp ||
    new Date() > admin.resetOtpExpiresAt
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  admin.resetOtp = undefined;
  admin.resetOtpExpiresAt = undefined;
  const resetToken = gen4DigitOtp() + gen4DigitOtp();
  admin.resetSessionToken = resetToken;
  admin.resetSessionExpiresAt = addMinutes(new Date(), 15);
  await admin.save();

  res.json({ resetToken });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const admin = await Admin.findOne({ email });
  if (
    !admin ||
    admin.resetSessionToken !== resetToken ||
    new Date() > admin.resetSessionExpiresAt
  ) {
    return res.status(400).json({ error: "Invalid reset session" });
  }

  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  admin.resetSessionToken = undefined;
  admin.resetSessionExpiresAt = undefined;
  admin.tokenVersion += 1;
  await admin.save();

  res.json({ message: "Password reset successful" });
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = req.admin;

  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Incorrect current password" });

  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  admin.tokenVersion += 1;
  await admin.save();

  res.json({ message: "Password changed" });
};

// Get profile
exports.getMe = (req, res) => {
  res.json({ admin: req.admin.toJSONSafe() });
};
