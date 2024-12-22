"use strict";

const { OK, CREATED } = require("../core/success.response");
const { UnauthorizedError } = require("../core/error.response");
const MessageService = require("../service/message.service");

class MessageController {
  createMessage = async (req, res, next) => {
    new CREATED({
      message: "Create Message Success!",
      metadata: await MessageService.createPrivateMessage(req),
    }).send(res);
  };
}

module.exports = new MessageController();
