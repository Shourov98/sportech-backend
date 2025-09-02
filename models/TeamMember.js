const mongoose3 = require("mongoose");

const TeamMemberSchema = new mongoose3.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    photo: String, // URL
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose3.model("TeamMember", TeamMemberSchema);
