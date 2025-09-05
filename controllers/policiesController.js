// controllers/policiesController.js
const Policy = require("../models/Policy");

// helper: basic validation for one policy payload
function validatePolicyPayload(p) {
  if (!p) return "payload required";
  if (!p.slug || typeof p.slug !== "string") return "slug is required";
  if (!p.title || typeof p.title !== "string") return "title is required";
  if (!Array.isArray(p.sections)) return "sections[] is required";
  for (const s of p.sections) {
    if (!s || typeof s.title !== "string")
      return "each section.title is required";
    if (!Array.isArray(s.description))
      return "each section.description[] is required";
  }
  return null;
}

// POST /api/policies  (admin) — create one
exports.createOne = async (req, res) => {
  try {
    const payload = {
      slug: String(req.body.slug || "")
        .toLowerCase()
        .trim(),
      title: req.body.title,
      subtitle: req.body.subtitle,
      sections: req.body.sections || [],
    };

    const err = validatePolicyPayload(payload);
    if (err) return res.status(400).json({ error: err });

    // prevent duplicates
    const exists = await Policy.exists({ slug: payload.slug });
    if (exists)
      return res
        .status(409)
        .json({ error: "Policy with this slug already exists" });

    const created = await Policy.create(payload);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// POST /api/policies/bulk  (admin) — create many
exports.createMany = async (req, res) => {
  try {
    const arr = Array.isArray(req.body) ? req.body : [];
    if (!arr.length)
      return res.status(400).json({ error: "Array of policies required" });

    // normalize/validate
    const docs = [];
    for (const raw of arr) {
      const p = {
        slug: String(raw.slug || "")
          .toLowerCase()
          .trim(),
        title: raw.title,
        subtitle: raw.subtitle,
        sections: raw.sections || [],
      };
      const err = validatePolicyPayload(p);
      if (err) return res.status(400).json({ error: err });
      docs.push(p);
    }

    // check for existing slugs
    const slugs = docs.map((d) => d.slug);
    const existing = await Policy.find({ slug: { $in: slugs } }).select("slug");
    if (existing.length) {
      return res.status(409).json({
        error: "Some slugs already exist",
        duplicates: existing.map((e) => e.slug),
      });
    }

    const created = await Policy.insertMany(docs);
    res.status(201).json({ count: created.length, items: created });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// GET /api/policies/:slug
exports.getBySlug = async (req, res) => {
  const slug = String(req.params.slug || "")
    .toLowerCase()
    .trim();
  const doc = await Policy.findOne({ slug });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
};

// PUT /api/policies/:slug (admin upsert)
exports.upsertBySlug = async (req, res) => {
  const slug = String(req.params.slug || "")
    .toLowerCase()
    .trim();

  // expected body: { title, subtitle, sections }
  const data = {
    slug,
    title: req.body.title,
    subtitle: req.body.subtitle,
    sections: req.body.sections || [],
  };

  if (!data.title || !Array.isArray(data.sections)) {
    return res.status(400).json({ error: "title and sections[] are required" });
  }

  const updated = await Policy.findOneAndUpdate({ slug }, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });

  res.json(updated);
};
