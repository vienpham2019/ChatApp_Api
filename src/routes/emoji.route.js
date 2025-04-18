"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");
const emojiController = require("../controllers/emoji.controller");

// router.use(authentication);
router.get("/categories", asyncHandler(emojiController.getAllCategories));

module.exports = router;
