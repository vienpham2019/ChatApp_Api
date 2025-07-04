"use strict";
const byscrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { getSelectData } = require("../util/db.util");
const {
  ConflictRequestError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} = require("../core/error.response");
const ImageService = require("./image.service");

class UserService {
  static async getUserByUserId({ userId, select = [] }) {
    const foundUser = await UserModel.findById(userId)
      .select(getSelectData(select))
      .lean()
      .exec();

    if (!foundUser) {
      throw new BadRequestError("User Not Found");
    }
    return foundUser;
  }
  static async getUserProfile({ userId }) {
    const users = {
      user1: {
        userId: "user1",
        name: "Alice Verzosa",
        profilePictureUrl: "https://i.pravatar.cc/150?img=1",
      },
      user2: {
        userId: "user2",
        name: "Trent Riewe",
        profilePictureUrl: "https://i.pravatar.cc/150?img=4",
      },
      user3: {
        userId: "user3",
        name: "Kimberly Claibome",
        profilePictureUrl: "https://i.pravatar.cc/150?img=9",
      },
    };

    return { user: users[userId] };
  }

  static async getUserByEmail({ email, select = [] }) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestError("Invalid Email");
    }
    try {
      return await UserModel.findOne({ email })
        .select(getSelectData(select))
        .lean()
        .exec();
    } catch (error) {
      console.log(error);
    }
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
    const foundUser = await UserService.getUserByEmail({ email });
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
    const foundUser = await UserService.getUserByEmail({ email });
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
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#!])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!regexPassword.test(password)) {
      throw new BadRequestError(
        "Password does not meet the required criteria."
      );
    }
    password = await byscrypt.hash(password, 10);
    const newUser = await UserModel.create({ email, password, fullName });
    if (!newUser) {
      throw new InternalServerError(
        `Unable to complete signup process. Please try again`
      );
    }
    return { message: "SignUp successful" };
  }

  static async updateProfile({ body, user }) {
    const { profilePic } = body;

    if (!profilePic) {
      throw new BadRequestError(
        "A profile picture is required. Please upload one to proceed."
      );
    }
    const { _id: userId } = user;
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: await ImageService.uploadImage(profilePic) },
        { new: true }
      ).lean();
      return updatedUser;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}

module.exports = UserService;
