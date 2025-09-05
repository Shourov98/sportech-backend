// models/ContactInfo.js
const mongoose = require("mongoose");

// Singleton document with numeric _id = 1
const ContactInfoSchema = new mongoose.Schema(
  {
    _id: { type: Number, default: 1 },
    location: String,
    email: String,
    phone: String,
    facebook: String,
    tiktok: String,
    instagram: String,
    youtube: String,
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("ContactInfo", ContactInfoSchema);
