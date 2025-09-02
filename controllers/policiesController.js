const Policy = require("../models/Policy");

exports.getBySlug = async (req, res) => {
  const doc = await Policy.findOne({ slug: req.params.slug.toLowerCase() });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
};

exports.upsertBySlug = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const updated = await Policy.findOneAndUpdate(
    { slug },
    { slug, ...req.body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(updated);
};
