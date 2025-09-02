const mongoose5 = require("mongoose");

// Singleton document with numeric _id = 1
const ContactInfoSchema = new mongoose5.Schema(
  {
    address: String,
    email: String,
    phone: String,
    facebook: String,
    tiktok: String,
    instagram: String,
    youtube: String,
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

module.exports = mongoose5.model("ContactInfo", ContactInfoSchema);
