const Feedback = require("../models/Feedback");

// accept only allowed fields
function mapBody(body = {}) {
  return {
    name: body.name,
    stars: body.stars,
    avatar: body.avatar,
    message: body.message,
  };
}

// GET /api/feedback
exports.list = async (req, res) => {
  const items = await Feedback.find({}).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

// POST /api/feedback   (public)
exports.create = async (req, res) => {
  try {
    const data = mapBody(req.body);

    if (!data.name || !data.name.trim())
      return res.status(400).json({ error: "name is required" });

    if (typeof data.stars !== "number" || data.stars < 1 || data.stars > 5)
      return res.status(400).json({ error: "stars must be between 1 and 5" });

    if (!data.message || !data.message.trim())
      return res.status(400).json({ error: "message is required" });

    // append to end
    const count = await Feedback.countDocuments({});
    const doc = await Feedback.create({ ...data, order: count });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// PUT /api/feedback/:id   (admin)
exports.update = async (req, res) => {
  try {
    const existing = await Feedback.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = mapBody(req.body);
    delete data.order; // keep order server-controlled

    // optional: validate stars range if provided
    if (data.stars !== undefined) {
      const s = Number(data.stars);
      if (!Number.isFinite(s) || s < 1 || s > 5) {
        return res.status(400).json({ error: "stars must be between 1 and 5" });
      }
    }

    const updated = await Feedback.findByIdAndUpdate(existing._id, data, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// OPTIONAL: DELETE /api/feedback/:id   (admin)
/*
exports.remove = async (req, res) => {
  const del = await Feedback.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });

  // compact order so it's 0..n-1
  const items = await Feedback.find({}).sort({ order: 1, createdAt: 1 }).select("_id");
  await Promise.all(items.map((doc, idx) => Feedback.findByIdAndUpdate(doc._id, { order: idx })));

  res.json({ message: "Deleted" });
};
*/
