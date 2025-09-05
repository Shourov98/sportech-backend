const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    avatar: { type: String, trim: true }, // user's profile image URL
    message: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }, // keep consistent with other resources
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
