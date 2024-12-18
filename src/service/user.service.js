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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid Email");
    }
    return await userModel
      .findOne({ email })
      .select(getSelectData(select))
      .lean()
      .exec();
  }

  static async foundUserByEmailAndPassword({ email, password }) {
    if (!password || !email) {
      const missingFields = [];
      if (!password) missingFields.push("Password");
      if (!email) missingFields.push("Email");

      throw new BadRequestError(
        `The following fields are required: ${missingFields.join(", ")}`
      );
    }
    const foundUser = UserService.getUserByEmail({ email });
    if (!foundUser) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const matchPassword = await byscrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }
    return {
      userId: foundUser._id,
    };
  }

  static async createUser({ email, password, fullName }) {
    if (!password || !email || !fullName) {
      const missingFields = [];
      if (!password) missingFields.push("Password");
      if (!email) missingFields.push("Email");
      if (!fullName) missingFields.push("Full Name");

      throw new BadRequestError(
        `The following fields are required: ${missingFields.join(", ")}`
      );
    }
    const foundUser = UserService.getUserByEmail({ email });
    if (foundUser) {
      throw new ConflictRequestError("Email already registered!");
    }
    /* 
      minLength: "Password must be at least 8 characters long.",
      lowercase: "Password must include at least one lowercase letter.",
      uppercase: "Password must include at least one uppercase letter.",
      digit: "Password must include at least one digit.",
      specialChar: "Password must include at least one special character (@$!%*?&).",
      noSpaces: "Password must not contain spaces."
    */
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regexPassword.test(password)) {
      throw new BadRequestError("Password meets all requirements.");
    }
    password = await byscrypt.hash(password, 10);
    const newUser = await userModel.create({ email, password, fullName });
    if (!newUser) {
      throw new InternalServerError(
        `Unable to complete signup process. Please try again`
      );
    }
    return { message: "SignUp successful" };
  }
}

module.exports = UserService;
