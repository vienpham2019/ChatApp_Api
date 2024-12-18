const { Types } = require("mongoose");

const convertToObjectIdMongoDB = (id) => new Types.ObjectId(id);
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = {
  convertToObjectIdMongoDB,
  getSelectData,
  getUnSelectData,
};
