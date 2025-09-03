// routes/contactRoutes.js
const express = require("express");
const ctrl = require("../controllers/contactController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Public read
router.get("/", ctrl.get);

// Admin-only update
router.put("/", auth, ctrl.update);

module.exports = router;
