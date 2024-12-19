const daysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
const hoursToMilliseconds = (hours) => hours * 60 * 60 * 1000;
const minsToMilliseconds = (mins) => mins * 60 * 1000;
const daysToSeconds = (days) => days * 24 * 60 * 60;
const hoursToSeconds = (hours) => hours * 60 * 60;
const minsToSeconds = (mins) => mins * 60;

module.exports = {
  daysToMilliseconds,
  hoursToMilliseconds,
  minsToMilliseconds,
  daysToSeconds,
  hoursToSeconds,
  minsToSeconds,
};
