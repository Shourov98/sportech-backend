const express = require("express");
const {
  seedAdmin,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  changePassword,
  getMe,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/health", (req, res) => res.json({ ok: true }));
router.post("/seed-admin", seedAdmin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/change-password", authMiddleware, changePassword);
router.get("/me", authMiddleware, getMe);

module.exports = router;
