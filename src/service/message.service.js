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
  static async findMessageById({ messageId, select = [] }) {
    return await MessageModel.findById(messageId)
      .select(getSelectData(select))
      .lean()
      .exec();
  }
  static async createPrivateMessage({ user, body }) {
    const { reciverId, text, image } = body;
    if ((!text || !image) && !reciverId) {
      throw new BadRequestError("Message content is required.");
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
    const newMessage = await MessageModel.create(payload);
    return newMessage;
  }

  static async deleteMessage({ params, user }) {
    try {
      const { messageId } = params;
      // Check if the message ID is valid
      if (!messageId) {
        throw new Error("Message ID is required.");
      }

      // Delete the message by its ID
      const result = await MessageModel.findOneAndDelete({
        _id: messageId,
        senderId: user._id,
      });

      // If no message was found and deleted, handle the error
      if (!result) {
        throw new Error("Message not found.");
      }

      // Return a success message
      return { message: "Message deleted successfully." };
    } catch (error) {
      throw new InternalServerError("Failed to delete message.");
    }
  }
}

module.exports = MessageService;
