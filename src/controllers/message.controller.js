"use strict";

const { OK, CREATED } = require("../core/success.response");
const MessageService = require("../service/message.service");

class MessageController {
  createMessage = async (req, res, next) => {
    new CREATED({
      message: "Create Message Success!",
      metadata: await MessageService.createPrivateMessage(req),
    }).send(res);
  };

  deleteMessage = async (req, res, next) => {
    new OK({
      message: "Delete Message Success!",
      metadata: await MessageService.deleteMessage(req),
    }).send(res);
  };
}

module.exports = new MessageController();
