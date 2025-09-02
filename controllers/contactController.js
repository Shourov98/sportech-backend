const ContactInfo = require("../models/ContactInfo");

exports.get = async (req, res) => {
  let doc = await ContactInfo.findById(1);
  if (!doc) {
    doc = await ContactInfo.create({ _id: 1 });
  }
  res.json(doc);
};

exports.update = async (req, res) => {
  const updated = await ContactInfo.findByIdAndUpdate(1, req.body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(updated);
};
