"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Emoji";
const COLLECTION_NAME = "Emojis";

// Declare the Schema of the Mongo model

const SkinSchema = new Schema({
  unified: { type: String, required: true },
  native: { type: String, required: true },
});

const EmojiSchema = new Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true },
    emoticons: [{ type: String }],
    keywords: [{ type: String }],
    skins: [SkinSchema],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

EmojiSchema.statics.getAllCategories = function () {
  return this.distinct("category");
};

EmojiSchema.statics.getGroupedByCategory = function () {
  return this.aggregate([
    {
      $project: {
        _id: 0,
        category: 1,
        name: 1,
        emoticons: 1,
        keywords: 1,
        skins: 1,
      },
    },
    {
      $group: {
        _id: "$category",
        emojis: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

EmojiSchema.index({ keywords: 1 });
EmojiSchema.index({ emoticons: 1 });
EmojiSchema.index({ name: "text" });
EmojiSchema.index({ categorie: 1 });

//Export the model
module.exports = { EmojiModel: model(DOCUMENT_NAME, EmojiSchema) };
