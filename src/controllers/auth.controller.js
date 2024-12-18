"use strict";

const UserService = require("../service/user.service");
const { OK, CREATED } = require("../core/success.response");
const { createTokenPair, clearJwtCookie } = require("../util/auth.util");
const { UnauthorizedError } = require("../core/error.response");
const JWT = require("jsonwebtoken");
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

  refresh = async (req, res, next) => {
    const { cookies } = req;
    const { jwt } = cookies;
    if (!jwt) {
      throw new UnauthorizedError(
        "Your login session has expired. Please log in again to continue."
      );
    }
    const { userId } = JWT.verify(jwt, process.env.JWT_SECRET);
    if (!userId) {
      throw new UnauthorizedError("Invalid Token");
    }
    const { accessToken } = createTokenPair({ payload: { userId }, res });
    new OK({
      message: "Refesh Token Success!",
      metadata: { accessToken },
    }).send(res);
  };

  logOut = async (req, res, next) => {
    clearJwtCookie(res);
    new OK({
      message: "LogOut Success!",
      metadata: { message: "LogOut Success!" },
    }).send(res);
  };
}

module.exports = new AuthController();
