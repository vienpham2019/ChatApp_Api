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
const messages = [
  {
    id: "msg1",
    userId: "user1", // Alice's user ID
    message: "Hey! Are we still on for the meeting today?",
    timestamp: "2025-04-11T09:15:00Z",
    isEdit: false,
    reactions: [
      { userId: "user2", emoji: "👍", emojiLabel: "thumbs up" },
      { userId: "user3", emoji: "✅", emojiLabel: "check mark" },
    ],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: true,
  },
  {
    id: "msg2",
    userId: "user1", // Alice's user ID
    message: "Just finished the report.",
    timestamp: "2025-04-11T09:15:30Z",
    isEdit: true,
    reactions: [{ userId: "user4", emoji: "🎉", emojiLabel: "party popper" }],
    attachments: [
      { fileUrl: "https://example.com/report.pdf", fileType: "file" }, // file attachment
    ],
    isDeleted: false,
    isGroupedWithPrev: true,
    isGroupedWithNext: false,
  },
  {
    id: "msg3",
    userId: "user2", // Bob's user ID
    message: "Great work on the report!",
    timestamp: "2025-04-11T09:17:22Z",
    isEdit: false,
    replyTo: "msg2", // replying to Alice's report
    reactions: [
      { userId: "user1", emoji: "😊", emojiLabel: "smiling face" },
      { userId: "user5", emoji: "👏", emojiLabel: "clapping hands" },
    ],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg4",
    userId: "user3", // Carol's user ID
    message: "I’ll bring the slides for the presentation.",
    timestamp: "2025-04-11T09:21:10Z",
    isEdit: false,
    reactions: [],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: true,
  },
  {
    id: "msg5",
    userId: "user3", // Dave's user ID
    message: "Meeting is in Room 302, right?",
    timestamp: "2025-04-11T09:21:45Z",
    isEdit: false,
    reactions: [],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: true,
    isGroupedWithNext: true,
  },
  {
    id: "msg5",
    userId: "user3", // Dave's user ID
    message: "I mean 301 !",
    timestamp: "2025-04-11T09:21:45Z",
    isEdit: false,
    reactions: [],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: true,
    isGroupedWithNext: false,
  },
  {
    id: "msg6",
    userId: "user3", // Eve's user ID
    message: "Running 5 minutes late, sorry!",
    timestamp: "2025-04-11T09:23:00Z",
    isEdit: false,
    reactions: [{ userId: "user2", emoji: "⏱️", emojiLabel: "stopwatch" }],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg7",
    userId: "user1", // Alice's user ID
    message: "Yes, Room 302. See you soon!",
    timestamp: "2025-04-11T09:24:30Z",
    isEdit: true,
    replyTo: "msg5", // replying to Dave
    reactions: [
      { userId: "user3", emoji: "🙂", emojiLabel: "slightly smiling face" },
      { userId: "user4", emoji: "👍", emojiLabel: "thumbs up" },
    ],
    attachments: [], // no attachments
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  // 5 more added messages
  {
    id: "msg8",
    userId: "user1", // New User (Grace)
    message: "I'll bring snacks for the meeting!",
    timestamp: "2025-04-11T09:30:15Z",
    isEdit: false,
    reactions: [{ userId: "user2", emoji: "🍪", emojiLabel: "cookie" }],
    attachments: [],
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg9",
    userId: "user1", // New User (Henry)
    message: "Can't wait for the presentation!",
    timestamp: "2025-04-11T09:32:00Z",
    isEdit: false,
    reactions: [{ userId: "user3", emoji: "🎤", emojiLabel: "microphone" }],
    attachments: [],
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg10",
    userId: "user2", // New User (Ivy)
    message: "Is the meeting room available now?",
    timestamp: "2025-04-11T09:35:00Z",
    isEdit: false,
    reactions: [],
    attachments: [],
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg11",
    userId: "user2", // New User (Jack)
    message: "I'm ready for the meeting.",
    timestamp: "2025-04-11T09:40:10Z",
    isEdit: false,
    reactions: [],
    attachments: [],
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
  {
    id: "msg12",
    userId: "user1", // Alice's user ID
    message: "Let's start the meeting!",
    timestamp: "2025-04-11T09:45:30Z",
    isEdit: false,
    reactions: [
      { userId: "user2", emoji: "🎉", emojiLabel: "party popper" },
      { userId: "user5", emoji: "👍", emojiLabel: "thumbs up" },
    ],
    attachments: [],
    isDeleted: false,
    isGroupedWithPrev: false,
    isGroupedWithNext: false,
  },
];
class MessageService {
  static async getAllMessages() {
    return { messages };
  }
  static async getMessageById(messageId) {
    return messages.find((msg) => msg.id === messageId);
  }
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
