"use strict";
const { getSelectData } = require("../util/db.util");
const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");
const { ChatRoomModel, ChatRoomEnum } = require("../models/chatRoom.model");
const { default: mongoose } = require("mongoose");
const { MessageModel } = require("../models/message.model");

class ChatRoomService {
  static async findPrivateChatRoom({ userId1, userId2 }) {
    const foundChatRoom = await ChatRoomModel.findOne({
      type: ChatRoomEnum.Type.PRIVATE, // Ensure it's a private chat room
      members: { $all: [userId1, userId2] }, // Match both user IDs
    });

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
    type = ChatRoomEnum.Type.PRIVATE,
  }) {
    try {
      if (!Array.isArray(members) || members.length < 1) {
        throw new BadRequestError("All field required");
      }
      members = [...members, user._id];
      const newChatRoom = await ChatRoomModel.create({
        members,
        type,
      });
      if (!newChatRoom) {
        throw new InternalServerError(
          `Unable to create chatroom. Please try again`
        );
      }
      return newChatRoom;
    } catch (error) {
      throw new InternalServerError("Unable to create chat room. " + error);
    }
  }

  static async deleteChatRoom({ user, params }) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const { chatRoomId } = params;
      // Check if the message ID is valid
      if (!chatRoomId) {
        throw new Error("Chat Room ID is required.");
      }

      // Delete the message by its ID
      const chatRoom = await ChatRoomModel.findByIdAndDelete(chatRoomId, {
        session,
      });
      // If no chatRoom was found and deleted, handle the error
      if (!chatRoom) {
        throw new Error("ChatRoom not found.");
      }

      const result = await MessageModel.deleteMany({ chatRoomId }, { session });
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Return a success message
      return {
        message: "ChatRoom deleted successfully.",
        deletedMessages: result.deletedCount,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new InternalServerError(" Failed to delete chat room.");
    }
  }
}

module.exports = ChatRoomService;
