const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const { InternalServerError } = require("../core/error.response");
const { daysToMilliseconds } = require("./index.util");
const createKey = () => {
  // Generate a 32-byte secret key (recommended length for many uses)
  return crypto.randomBytes(32).toString("hex");
};

const createTokenPair = async ({ payload, res }) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, JWT_SECRET, {
      expiresIn: "7 days",
    });
    setJwtCookie({ res, refreshToken });
    return { accessToken };
  } catch (error) {
    throw new InternalServerError(error);
  }
};

const setJwtCookie = ({ res, refreshToken }) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: process.env.NODE_ENV === "production", // https
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // cross-site cookie
    maxAge: daysToMilliseconds(7), // 7 days
  });
};

const clearJwtCookie = ({ res }) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  });
};

module.exports = {
  createKey,
  createTokenPair,
  setJwtCookie,
  clearJwtCookie,
};
