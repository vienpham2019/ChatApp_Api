"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const AuthController = require("../controllers/auth.controller");

router.post("/logIn", asyncHandler(AuthController.logIn));

module.exports = router;
