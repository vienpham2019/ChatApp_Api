"use strict";

const UserService = require("../service/user.service");
const { OK, CREATED } = require("../core/success.response");
const { UnauthorizedError } = require("../core/error.response");

class UserController {
  getUserProfile = async (req, res, next) => {
    new OK({
      message: "Get Profile Success!",
      metadata: await UserService.getUserProfile(req.params),
    }).send(res);
  };
  updateProfile = async (req, res, next) => {
    new CREATED({
      message: "Update Profile Success!",
      metadata: await UserService.updateProfile(req),
    }).send(res);
  };
}

module.exports = new UserController();
