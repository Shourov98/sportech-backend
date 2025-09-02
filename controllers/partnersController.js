// controllers/partnersController.js
const Partner = require("../models/Partner");
const slugify = require("../utils/slugify");

/** map allowed client fields -> model fields */
function mapBody(body = {}) {
  return {
    name: body.name, // required
    shortDesc: body.short_description, // maps to shortDesc
    description: body.description,
    website: body.website,
    googlePlay: body.googleplay, // maps to googlePlay
    appGallery: body.appgallary ?? body.appgallery, // tolerate both spellings
    logo: body.logo,
    // slug, order, published are controlled by server
  };
}

/** ensure unique slug (slug, slug-2, slug-3, ...) */
async function uniqueSlugFromName(name, ignoreId = null) {
  const base = slugify(name || "");
  const fallback = String(Date.now());
  if (!base) return fallback;

  let candidate = base;
  let i = 2;
  /* eslint-disable no-await-in-loop */
  while (true) {
    const query = ignoreId
      ? { slug: candidate, _id: { $ne: ignoreId } }
      : { slug: candidate };
    const exists = await Partner.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${i++}`;
  }
}

exports.list = async (req, res) => {
  const { published, q } = req.query;
  const where = {};
  if (published !== undefined) where.published = published === "true";
  if (q)
    where.$or = [{ name: new RegExp(q, "i") }, { slug: new RegExp(q, "i") }];

  const items = await Partner.find(where).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const data = mapBody(req.body);

    if (!data.name || !data.name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }

    // slug from name (unique)
    const slug = await uniqueSlugFromName(data.name);

    // order = current count (append to end)
    const count = await Partner.countDocuments({});
    const doc = await Partner.create({
      ...data,
      slug,
      order: count,
      published: true, // default
    });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.get = async (req, res) => {
  const doc = await Partner.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
};

exports.update = async (req, res) => {
  try {
    const existing = await Partner.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = mapBody(req.body);

    // if name changes, regenerate unique slug
    if (
      typeof data.name === "string" &&
      data.name.trim() &&
      data.name !== existing.name
    ) {
      data.slug = await uniqueSlugFromName(data.name, existing._id);
    }

    // do not let client change order/published here (unless you add dedicated endpoints)
    delete data.order;
    delete data.published;
    delete data.slug; // will be re-added above only when name changed

    const updated = await Partner.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  const del = await Partner.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });

  // compact order after deletion to keep 0..n-1
  const items = await Partner.find({})
    .sort({ order: 1, createdAt: 1 })
    .select("_id");
  await Promise.all(
    items.map((doc, idx) => Partner.findByIdAndUpdate(doc._id, { order: idx }))
  );

  res.json({ message: "Deleted" });
};
