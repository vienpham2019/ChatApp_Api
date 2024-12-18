"use strict";

const express = require("express");
const router = express.Router();
const { asyncHandler } = require("../helper/asyncHandler");
const AuthController = require("../controllers/auth.controller");

router.post("/signUp", asyncHandler(AuthController.signUp));
router.post("/login", asyncHandler(AuthController.logIn));
router.get("/refresh", asyncHandler(AuthController.refresh));
router.get("/logOut", asyncHandler(AuthController.logOut));

module.exports = router;
