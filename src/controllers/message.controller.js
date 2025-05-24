"use strict";

const { OK, CREATED } = require("../core/success.response");
const MessageService = require("../service/message.service");

class MessageController {
  getAllMessages = async (req, res, next) => {
    new OK({
      message: "Get All Message Success!",
      metadata: await MessageService.getAllMessages(),
    }).send(res);
  };

  getMessageById = async (req, res, next) => {
    new OK({
      message: "Get Message Success!",
      metadata: await MessageService.getMessageById(req.params),
    }).send(res);
  };

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
