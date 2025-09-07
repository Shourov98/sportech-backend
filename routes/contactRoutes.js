// routes/contactRoutes.js
const express = require("express");
const ctrl = require("../controllers/contactController");
const contactMessageCtrl = require("../controllers/contactMessageController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", ctrl.get); // public
router.post("/", auth, ctrl.create); // admin: create once
router.put("/", auth, ctrl.update); // admin: update
router.post("/send-message", contactMessageCtrl.sendMessage); // public contact form

module.exports = router;
