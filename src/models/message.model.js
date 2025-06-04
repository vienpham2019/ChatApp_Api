"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "Messages";

const ReactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emoji: {
      type: Schema.Types.ObjectId,
      ref: "Emoji",
      required: true,
    },
  },
  { _id: false }
);

// Declare the Schema of the Mongo model
const messageSchema = new Schema(
  {
    channelId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
    isEdit: { type: Boolean, default: false },
    reactions: [ReactionSchema],
    attachments: [String],
    isDeleted: { type: Boolean, default: false },
    isGroupedWithPrev: { type: Boolean, default: false },
    isGroupedWithNext: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = { MessageModel: model(DOCUMENT_NAME, messageSchema) };
