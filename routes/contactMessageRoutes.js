const express = require("express");
const ctrl = require("../controllers/contactMessageController");
const router = express.Router();

router.post("/send-message", ctrl.sendMessage);

module.exports = router;
