const mongoose6 = require("mongoose");

const PolicySchema = new mongoose6.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    }, // e.g. privacy-policy
    title: { type: String, required: true },
    subtitle: String,
    content: { type: String, required: true }, // markdown or rich text JSON as string
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

module.exports = mongoose6.model("Policy", PolicySchema);
