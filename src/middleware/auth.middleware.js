"use strict";
const JWT = require("jsonwebtoken");
const { UnauthorizedError } = require("../core/error.response");
const { asyncHandler } = require("../helper/asyncHandler");
const UserService = require("../service/user.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "athorization",
};
const authentication = asyncHandler(async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.jwt) {
    throw new UnauthorizedError("No cookie");
  }

  // verify access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No access token");
  }

  try {
    const decodeUser = JWT.verify(
      accessToken.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (!decodeUser) {
      throw new UnauthorizedError("Invalid Token");
    }
    // Ok all then return next
    req.user = UserService.getUserByUserId({
      userId: decodeUser.userId,
      select: ["_id", "email", "fullName", "profilePic"],
    });
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = { authentication };
