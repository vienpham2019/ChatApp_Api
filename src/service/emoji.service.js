"use strict";
const { InternalServerError } = require("../core/error.response");
const { EmojiModel } = require("../models/emoji.model");
class EmojiService {
  static async getAllEmojis() {
    try {
      let emojis = await EmojiModel.getAllEmojis();
      return {
        emojis,
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async getByCategories(categories) {
    try {
      const emojis = await EmojiModel.getByCategories(categories);
      return {
        emojis,
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async getAllCategoryCounts() {
    try {
      let categoryCounts = await EmojiModel.getCategoryCounts();
      categoryCounts.unshift({ _id: "Recently Used", count: 5 });

      return {
        categoryCounts,
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async searchEmojis(searchQuery) {
    try {
      let emojis = await EmojiModel.searchEmojis(searchQuery);
      return { emojis };
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
module.exports = EmojiService;
