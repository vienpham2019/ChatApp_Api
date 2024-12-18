const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

// init middlewares
app.use(express.json());
//Parses cookies attached to incoming requests, making them available in req.cookies for easy access in your route handlers.
app.use(cookieParser());
// init db
require("./db/init.mongodb");

// init routes
app.use("/v1/api", require("./routes/_index"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusError = error.status || 500;
  return res.status(statusError).json({
    status: "error",
    code: statusError,
    stack: error.stack, // only for dev enviroment
    message: error.message || "Internal Server Errror",
  });
});

module.exports = app;
