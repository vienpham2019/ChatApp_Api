"use strict";

const UserService = require("../service/user.service");
const { OK } = require("../core/success.response");
class AuthController {
  logIn = async (req, res, next) => {};

  resetPassword = async (req, res, next) => {};

  forgotPassword = async (req, res, next) => {};

  signUp = async (req, res, next) => {
    new OK({
      message: "Sign Up successfully!",
      metadata: await UserService.createUser(req.body),
    }).send(res);
  };

  refresh = async (req, res, next) => {};

  logOut = async (req, res, next) => {};
}

module.exports = new AuthController();
