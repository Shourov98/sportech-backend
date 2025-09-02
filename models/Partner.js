// models/Partner.js
const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    shortDesc: { type: String, trim: true }, // maps from short_description
    description: { type: String, trim: true },
    website: { type: String, trim: true },
    googlePlay: { type: String, trim: true }, // maps from googleplay
    appGallery: { type: String, trim: true }, // maps from appgallary/appgallery
    logo: { type: String, trim: true }, // Cloudinary URL
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", PartnerSchema);
