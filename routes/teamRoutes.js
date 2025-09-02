const express = require("express");
const ctrl = require("../controllers/teamController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", ctrl.list);
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
