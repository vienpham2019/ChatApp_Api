"use strict";
const { getSelectData } = require("../util/db.util");
const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const { ChatRoomModel, ChatRoomEnum } = require("../models/chatRoom.model");

class ChatRoomService {
  static async findPrivateChatRoom({ userId1, userId2 }) {
    const foundChatRoom = await ChatRoomModel.findOne({
      type: ChatRoomEnum.Type.PRIVATE, // Ensure it's a private chat room
      members: { $all: [userId1, userId2] }, // Match both user IDs
    });
    if (!foundChatRoom) {
      throw new BadRequestError("Chat room not found");
    }
    return foundChatRoom;
  }
  static async findChatRoomById({ chatRoomId, userId }) {
    const foundChatRoom = await ChatRoomModel.findOne({ _id: chatRoomId });
    if (!foundChatRoom) {
      throw new BadRequestError("Chat room not found");
    }
    if (!foundChatRoom.members.includes(userId)) {
      throw new BadRequestError(
        "You do not have permission to access this chat room."
      );
    }
    return foundChatRoom;
  }

  static async addMemberToGroupChat({ body, user }) {
    try {
      const { chatRoomId, addUserId } = body;
      // Find the group chat room by Id
      const foundChatRoom = await ChatRoomService.findChatRoomById({
        chatRoomId,
        userId: user._id,
      });
      if (foundChatRoom.type === ChatRoomEnum.Type.GROUP) {
        throw new BadRequestError("User is already a member of this group.");
      }
      // Check if the user is already a member of the group chat
      if (foundChatRoom.members.includes(addUserId)) {
        throw new BadRequestError("User is already a member of this group.");
      }

      // Add the new member to the members array
      foundChatRoom.members.push(addUserId);

      // Save the updated chat room document
      await foundChatRoom.save();

      // Return the updated chat room
      return foundChatRoom;
    } catch (error) {
      throw new InternalServerError("Unable to add member to group chat.");
    }
  }

  static async createChatRoom({
    user,
    members,
    type = Enum.ChatRoomType.PRIVATE,
  }) {
    try {
      if (!Array.isArray(members) || members.length < 1) {
        throw new BadRequestError("All field required");
      }
      members.push(user._id);
      const newChatRoom = await ChatRoomModel.create({
        members,
        type,
      });
      if (!newChatRoom) {
        throw new InternalServerError(
          `Unable to create chatroom. Please try again`
        );
      }
      return { message: "Create chat room successful" };
    } catch (error) {
      throw new InternalServerError("Unable to create chat room.");
    }
  }
}

module.exports = ChatRoomService;
