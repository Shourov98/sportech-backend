const crypto = require("crypto");

exports.sign = async (req, res) => {
  const { folder = "uploads" } = req.body || {};
  const timestamp = Math.floor(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName)
    return res.status(500).json({ error: "Cloudinary env missing" });

  // params to sign (alphabetical order)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign)
    .digest("hex");

  res.json({ timestamp, folder, signature, apiKey, cloudName });
};
