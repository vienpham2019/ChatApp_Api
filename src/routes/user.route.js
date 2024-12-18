"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");

router.use(authentication);

module.exports = router;
