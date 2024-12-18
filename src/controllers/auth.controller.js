"use strict";

const UserService = require("../service/user.service");
const { OK, CREATED } = require("../core/success.response");
const { createTokenPair, clearJwtCookie } = require("../util/auth.util");
class AuthController {
  logIn = async (req, res, next) => {
    const { userId } = await UserService.foundUserByEmailAndPassword(req.body);
    const { accessToken } = createTokenPair({ payload: { userId }, res });
    new OK({
      message: "LogIn successfully!",
      metadata: { accessToken },
    }).send(res);
  };

  resetPassword = async (req, res, next) => {};

  forgotPassword = async (req, res, next) => {};

  signUp = async (req, res, next) => {
    new CREATED({
      message: "SignUp successfully!",
      metadata: await UserService.createUser(req.body),
    }).send(res);
  };

  refresh = async (req, res, next) => {};

  logOut = async (req, res, next) => {
    clearJwtCookie(res);
    new OK({
      message: "LogOut Success!",
      metadata: { message: "LogOut Success!" },
    }).send(res);
  };
}

module.exports = new AuthController();
