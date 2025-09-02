const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    resetOtp: String,
    resetOtpExpiresAt: Date,
    resetSessionToken: String,
    resetSessionExpiresAt: Date,
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AdminSchema.methods.toJSONSafe = function () {
  return { id: this._id, email: this.email, createdAt: this.createdAt };
};

module.exports = mongoose.model("Admin", AdminSchema);
