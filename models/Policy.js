// models/Policy.js
const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: [{ type: String, required: true }],
});

const PolicySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    }, // e.g. "terms-and-conditions"
    title: { type: String, required: true },
    subtitle: String,
    sections: [SectionSchema], // array of sections
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Policy", PolicySchema);
