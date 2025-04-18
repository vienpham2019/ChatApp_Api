"use strict";
const { InternalServerError } = require("../core/error.response");
const { EmojiModel } = require("../models/emoji.model");
class EmojiService {
  static async getAllCategories() {
    try {
      const categories = await EmojiModel.getGroupedByCategory();
      return {
        categories,
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
module.exports = EmojiService;
