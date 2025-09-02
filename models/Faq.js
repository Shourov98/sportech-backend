const mongoose4 = require("mongoose");

const FaqSchema = new mongoose4.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose4.model("Faq", FaqSchema);
