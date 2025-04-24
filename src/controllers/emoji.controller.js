"use strict";

const { OK, CREATED } = require("../core/success.response");
const EmojiService = require("../service/emoji.service");

class EmojiController {
  getByCategories = async (req, res, next) => {
    new OK({
      message: "Get All Category Success!",
      metadata: await EmojiService.getByCategories(req.body),
    }).send(res);
  };

  getAllCategoryCounts = async (req, res, next) => {
    new OK({
      message: "Get All Category Success!",
      metadata: await EmojiService.getAllCategoryCounts(),
    }).send(res);
  };

  searchEmojis = async (req, res, next) => {
    new OK({
      message: "Search Emojis Success!",
      metadata: await EmojiService.searchEmojis(req.query.searchQuery),
    }).send(res);
  };
}

module.exports = new EmojiController();
