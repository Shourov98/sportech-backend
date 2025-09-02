const TeamMember = require("../models/TeamMember");

exports.list = async (req, res) => {
  const items = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
  res.json(items);
};

exports.create = async (req, res) => {
  try {
    const item = await TeamMember.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  const item = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
};

exports.remove = async (req, res) => {
  const item = await TeamMember.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ message: "Deleted" });
};
