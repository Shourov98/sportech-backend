// controllers/servicesController.js
const Service = require("../models/Service");
const slugify = require("../utils/slugify");

// Map client payload -> allowed model fields
function mapBody(body = {}) {
  return {
    title: body.title, // required
    subtitle: body.subtitle,
    shortDesc: body.short_description, // map snake_case → camelCase
    description: body.description,
    bannerImage: body.banner_image ?? body.bannerImage,
    rightImage: body.right_image ?? body.rightImage,
    // slug, order, published are handled by server
  };
}

// Generate a unique slug from title
async function uniqueSlugFromTitle(title, ignoreId = null) {
  const base = slugify(String(title || "").trim());
  const fallback = String(Date.now());
  if (!base) return fallback;

  let candidate = base;
  let i = 2;
  while (true) {
    const query = ignoreId
      ? { slug: candidate, _id: { $ne: ignoreId } }
      : { slug: candidate };
    const exists = await Service.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${i++}`;
  }
}

exports.list = async (req, res) => {
  const { published, q } = req.query;
  const where = {};
  if (published !== undefined) where.published = published === "true";
  if (q)
    where.$or = [{ title: new RegExp(q, "i") }, { slug: new RegExp(q, "i") }];

  const items = await Service.find(where).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const data = mapBody(req.body);

    if (!data.title || !data.title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    const slug = await uniqueSlugFromTitle(data.title);
    const count = await Service.countDocuments({});

    const doc = await Service.create({
      ...data,
      slug,
      order: count,
      published: true,
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.get = async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
};

exports.update = async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = mapBody(req.body);

    // regenerate slug if title changed
    if (
      typeof data.title === "string" &&
      data.title.trim() &&
      data.title !== existing.title
    ) {
      data.slug = await uniqueSlugFromTitle(data.title, existing._id);
    }

    delete data.order;
    delete data.published;

    const updated = await Service.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  const del = await Service.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });

  // compact order
  const items = await Service.find({})
    .sort({ order: 1, createdAt: 1 })
    .select("_id");
  await Promise.all(
    items.map((doc, idx) => Service.findByIdAndUpdate(doc._id, { order: idx }))
  );

  res.json({ message: "Deleted" });
};
