"use strict";

const { UnauthorizedError } = require("../core/error.response");

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
    if (userId != decodeUser.userId) {
      throw new UnauthorizedError("User id not match");
    }
    // Ok all then return next
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = { authentication };
