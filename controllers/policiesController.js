const Policy = require("../models/Policy");

exports.getBySlug = async (req, res) => {
  const slug = String(req.params.slug || "")
    .toLowerCase()
    .trim();
  const doc = await Policy.findOne({ slug });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
};

exports.upsertBySlug = async (req, res) => {
  const slug = String(req.params.slug || "")
    .toLowerCase()
    .trim();

  // Accept only these fields from body
  const data = {
    slug, // always from param
    title: req.body?.title,
    subtitle: req.body?.subtitle,
    content: req.body?.content,
  };

  // Optional: early validation so you get a clear 400 instead of schema error
  if (!data.title || !data.content) {
    return res.status(400).json({ error: "title and content are required" });
  }

  const updated = await Policy.findOneAndUpdate({ slug }, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
  res.json(updated);
};
