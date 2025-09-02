// models/Service.js
const mongoose2 = require("mongoose");

const ServiceSchema = new mongoose2.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true },
    subtitle: String,
    shortDesc: String,
    description: String,
    bannerImage: String, // /service/... or URL
    rightImage: String, // /service/[slug]-image.png or URL
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose2.model("Service", ServiceSchema);
