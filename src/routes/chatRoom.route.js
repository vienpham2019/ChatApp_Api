"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");
const chatRoomController = require("../controllers/chatRoom.controller");

router.get(
  "/info/:chatRoomId",
  asyncHandler(chatRoomController.getChatRoomInfo)
);
router.use(authentication);
router.delete("/:chatRoomId", asyncHandler(chatRoomController.deleteChatRoom));

module.exports = router;
