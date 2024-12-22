"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "ChatRoom";
const COLLECTION_NAME = "ChatRooms";

const Type = Object.freeze({
  PRIVATE: "Private",
  GROUP: "Group",
});

// Declare the Schema of the Mongo model
const chatRoomSchema = new Schema(
  {
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true, // Each member must be valid
        },
      ],
      required: true, // Ensure the array itself is required
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2, // Custom validation for non-empty array
        message: "The members array must contain at least 2 users.",
      },
    },
    type: {
      type: String,
      enum: Object.values(Type),
      default: Type.PRIVATE,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Add index for members
chatRoomSchema.index({ members: 1 });

//Export the model
module.exports = {
  ChatRoomModel: model(DOCUMENT_NAME, chatRoomSchema),
  ChatRoomEnum: {
    Type,
  },
};
