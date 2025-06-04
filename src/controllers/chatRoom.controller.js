"use strict";

const { OK, CREATED } = require("../core/success.response");
const ChatRoomService = require("../service/chatRoom.service");

class ChatRoomController {
  getChatRoomInfo = async (req, res, next) => {
    new OK({
      message: "Get Chat Room Info Success!",
      metadata: await ChatRoomService.getChatRoomInfo(req.params),
    }).send(res);
  };
  deleteChatRoom = async (req, res, next) => {
    new OK({
      message: "Delete ChatRoom Success!",
      metadata: await ChatRoomService.deleteChatRoom(req),
    }).send(res);
  };
}

module.exports = new ChatRoomController();
