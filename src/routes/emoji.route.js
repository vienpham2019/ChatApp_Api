"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");
const emojiController = require("../controllers/emoji.controller");

// router.use(authentication);
router.get("/allEmojis", asyncHandler(emojiController.getAllEmojis));
router.get(
  "/categoryCounts",
  asyncHandler(emojiController.getAllCategoryCounts)
);
router.get("/search", asyncHandler(emojiController.searchEmojis));

router.post("/getByCategories", asyncHandler(emojiController.getByCategories));

module.exports = router;
