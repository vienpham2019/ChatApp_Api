"use strict";
const { getSelectData } = require("../util/db.util");
const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const ChatRoomService = require("./chatRoom.service");
const { MessageModel } = require("../models/message.model");
const UserService = require("./user.service");
const ImageService = require("./image.service");

class MessageService {
  static async createPrivateMessage({ user, body }) {
    try {
      const { reciverId, text, image } = body;
      if (!text || !image) {
        throw new BadRequestError("Message content required");
      }
      await UserService.getUserByUserId({ userId: reciverId }); // check for valid user
      let foundChatRoom = await ChatRoomService.findPrivateChatRoom({
        userId1: user._id,
        userId2: reciverId,
      });
      if (!foundChatRoom) {
        foundChatRoom = await ChatRoomService.createChatRoom({
          user,
          members: [reciverId],
        });
      }
      let payload = { senderId: user._id, chatRoomId: foundChatRoom._id };
      if (text) payload.text = text;
      if (image) {
        payload.imageUrl = await ImageService.uploadImage(image);
      }
      const newMessage = await MessageModel.create(payload).lean();
      return newMessage;
    } catch (error) {
      throw new InternalServerError("Unable to create message");
    }
  }
}

module.exports = MessageService;
