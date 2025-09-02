const express = require("express");
const ctrl = require("../controllers/faqsController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// public read
router.get("/", ctrl.list);

// admin-only mutations
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
