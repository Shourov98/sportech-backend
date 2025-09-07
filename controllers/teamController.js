const TeamMember = require("../models/TeamMember");

/** whitelist incoming fields */
function mapBody(body = {}) {
  return {
    name: body.name,
    role: body.role,
    photo: body.photo,
    // order is server-controlled
  };
}

exports.list = async (req, res) => {
  const items = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const data = mapBody(req.body);

    if (!data.name || !data.name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    if (!data.role || !data.role.trim()) {
      return res.status(400).json({ error: "role is required" });
    }

    // append to end
    const count = await TeamMember.countDocuments({});
    const doc = await TeamMember.create({ ...data, order: count });

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await TeamMember.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = mapBody(req.body);
    delete data.order; // do not allow direct order changes here

    const updated = await TeamMember.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
+0;
exports.remove = async (req, res) => {
  const del = await TeamMember.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ error: "Not found" });

  // compact order after deletion
  const items = await TeamMember.find({})
    .sort({ order: 1, createdAt: 1 })
    .select("_id");
  await Promise.all(
    items.map((doc, idx) =>
      TeamMember.findByIdAndUpdate(doc._id, { order: idx })
    )
  );

  res.json({ message: "Deleted" });
};
