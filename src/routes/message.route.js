"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");
const MessageController = require("../controllers/message.controller");

router.use(authentication);
router.post("/newMessage", asyncHandler(MessageController.createMessage));
router.delete("/:messageId", asyncHandler(MessageController.deleteMessage));

module.exports = router;
