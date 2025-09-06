// controllers/contactController.js
const ContactInfo = require("../models/ContactInfo");
const sendMail = require("../utils/mailer");

// GET /api/contact  (public)
exports.get = async (_req, res) => {
  let doc = await ContactInfo.findById(1);
  if (!doc) doc = await ContactInfo.create({ _id: 1 });
  res.json(doc);
};

// POST /api/contact  (admin) — create once
exports.create = async (req, res) => {
  const exists = await ContactInfo.findById(1);
  if (exists)
    return res.status(409).json({ error: "Contact info already exists" });

  const payload = {
    _id: 1,
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone,
    facebook: req.body.facebook,
    tiktok: req.body.tiktok,
    instagram: req.body.instagram,
    youtube: req.body.youtube,
  };

  const created = await ContactInfo.create(payload);
  res.status(201).json(created);
};

// PUT /api/contact  (admin) — update
exports.update = async (req, res) => {
  const allowed = {
    location: req.body.location,
    email: req.body.email,
    phone: req.body.phone,
    facebook: req.body.facebook,
    tiktok: req.body.tiktok,
    instagram: req.body.instagram,
    youtube: req.body.youtube,
  };

  const updated = await ContactInfo.findByIdAndUpdate(1, allowed, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
  res.json(updated);
};

// POST /api/contact/send-message  (public) — contact form
// controllers/contactController.js
// <-- default import

exports.sendMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, message, phone } = req.body;
    const name = `${firstName} ${lastName}`;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email, and message are required" });
    }

    const subject = `New contact message from ${name}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendMail(
      process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject,
      html
    );
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Mail send failed:", err?.response || err?.message || err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
