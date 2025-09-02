const Faq = require("../models/Faq");

/** whitelist incoming fields */
function mapBody(body = {}) {
  return {
    question: body.question,
    answer: body.answer,
    // order is server-controlled
  };
}

exports.list = async (req, res) => {
  const items = await Faq.find({}).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const data = mapBody(req.body);

    if (!data.question || !data.question.trim()) {
      return res.status(400).json({ error: "question is required" });
    }
    if (!data.answer || !data.answer.trim()) {
      return res.status(400).json({ error: "answer is required" });
    }

    // append to end
    const count = await Faq.countDocuments({});
    const doc = await Faq.create({ ...data, order: count });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Faq.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = mapBody(req.body);
    delete data.order; // prevent direct order edits here

    const updated = await Faq.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  const del = await Faq.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });

  // compact order after deletion
  const items = await Faq.find({})
    .sort({ order: 1, createdAt: 1 })
    .select("_id");
  await Promise.all(
    items.map((doc, idx) => Faq.findByIdAndUpdate(doc._id, { order: idx }))
  );

  res.json({ message: "Deleted" });
};
