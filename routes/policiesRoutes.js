const express = require("express");
const ctrl = require("../controllers/policiesController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create
router.post("/", auth, ctrl.createOne); // create one
router.post("/bulk", auth, ctrl.createMany); // create many

// Read/Update
router.get("/:slug", ctrl.getBySlug); // public
router.put("/:slug", auth, ctrl.upsertBySlug); // admin

module.exports = router;
