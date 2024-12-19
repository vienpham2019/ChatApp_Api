const rateLimit = require("express-rate-limit");
const {
  minsToMilliseconds,
  hoursToMilliseconds,
} = require("../util/index.util");

const createLimiter = ({ windowMs, max, duration }) => {
  return rateLimit({
    windowMs,
    max, // Limit each Ip to 5 login requests per `window` per minute
    message: {
      message: `Too many requests from this IP, please try again after a ${duration}.`,
    },
    handler: (req, res, next, options) => {
      res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `ratelimit - *` headers
    legacyHeaders: false, // Disable the `X-Ratelimit-*` headers
  });
};
const hourLimiter = ({ hour, max = 5 }) => {
  return createLimiter({
    windowMs: hoursToMilliseconds(hour),
    max,
    duration: `${hour} hour${hour > 1 && "s"}`,
  });
};

const minLimiter = ({ min, max = 5 }) => {
  return createLimiter({
    windowMs: minsToMilliseconds(min),
    max,
    duration: `${min} min${min > 1 && "s"}`,
  });
};

module.exports = { minLimiter, hourLimiter };
