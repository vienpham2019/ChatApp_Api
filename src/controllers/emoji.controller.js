"use strict";

const { OK, CREATED } = require("../core/success.response");
const EmojiService = require("../service/emoji.service");

class EmojiController {
  getAllCategories = async (req, res, next) => {
    new OK({
      message: "Get All Categories Success!",
      metadata: await EmojiService.getAllCategories(),
    }).send(res);
  };
}

module.exports = new EmojiController();
