"use strict";

const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));
router.use("/message", require("./message.route"));
router.use("/chatRoom", require("./chatRoom.route"));

module.exports = router;
