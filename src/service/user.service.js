"use strict";
const byscrypt = require("bcrypt");
const userModel = require("../models/user.model");
const { getSelectData } = require("../util/db.util");
const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");

class UserService {
  static async getUserByEmail({ email, select = [] }) {
    return await userModel
      .findOne({ email })
      .select(getSelectData(select))
      .lean()
      .exec();
  }
  static async createUser({ email, password, fullName }) {
    const foundUser = UserService.getUserByEmail({ email });
    if (foundUser) {
      throw new ConflictRequestError("Email already registered!");
    }
    password = await byscrypt.hash(password, 10);
    const newUser = await userModel.create({ email, password, fullName });
    if (!newUser) {
      throw new BadRequestError(`Invalid user data received`);
    }
    return { message: "SignUp successful" };
  }
}

module.exports = UserService;
