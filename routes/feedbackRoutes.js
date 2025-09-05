const express = require("express");
const ctrl = require("../controllers/feedbackController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", ctrl.list); // public
router.post("/", ctrl.create); // public (users submit feedback)
router.put("/:id", auth, ctrl.update); // admin only
// router.delete("/:id", auth, ctrl.remove); // optional

module.exports = router;
