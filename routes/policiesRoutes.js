const express = require("express");
const ctrl = require("../controllers/policiesController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Public read by slug (e.g., privacy-policy, terms-and-conditions)
router.get("/:slug", ctrl.getBySlug);

// Admin upsert by slug
router.put("/:slug", auth, ctrl.upsertBySlug);

module.exports = router;
