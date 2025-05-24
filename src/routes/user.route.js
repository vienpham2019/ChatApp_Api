"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const { authentication } = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/userProfile/:userId", asyncHandler(userController.getUserProfile));
router.use(authentication);
router.patch("/updateProfilePic", asyncHandler(userController.updateProfile));

module.exports = router;
