"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const AuthController = require("../controllers/auth.controller");
const { minLimiter } = require("../middleware/limiter.middleware");

router.post(
  "/signUp",
  minLimiter({ min: 4 }),
  asyncHandler(AuthController.signUp)
);
router.post(
  "/logIn",
  minLimiter({ min: 1 }),
  asyncHandler(AuthController.logIn)
);
router.get("/refresh", asyncHandler(AuthController.refresh));
router.get("/logOut", asyncHandler(AuthController.logOut));

module.exports = router;
