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

EmojiSchema.statics.getByCategories = function (categories) {
  const queries = categories.map((category) => {
    if (category === "Recently Used") {
      return this.aggregate([
        { $match: { category: { $ne: null } } }, // or remove if not needed
        { $sample: { size: 5 } }, // randomly pick 5
        {
          $project: {
            _id: 0,
            name: 1,
            emoticons: 1,
            skins: 1,
          },
        },
      ]);
    } else {
      return this.find(
        { category },
        { _id: 0, name: 1, emoticons: 1, skins: 1 }
      );
    }
  });

  return Promise.all(queries);
};

EmojiSchema.statics.getCategoryCounts = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

EmojiSchema.statics.searchEmojis = function (query) {
  const isSymbolSearch = /[^a-zA-Z0-9\s]/.test(query);

  if (isSymbolSearch) {
    return this.find({
      emoticons: { $in: [query] },
    }).select("name skins emoticons");
  }

  // Default full-text search
  return this.find({
    $or: [
      { name: new RegExp(query, "i") },
      { keywords: { $elemMatch: { $regex: query, $options: "i" } } },
    ],
  }).select("name skins emoticons");
};

EmojiSchema.index({ name: 1 }); // For regex on name
EmojiSchema.index({ keywords: 1 }); // For regex match inside array
EmojiSchema.index({ emoticons: 1 }); // For symbol/emoticon search

//Export the model
module.exports = { EmojiModel: model(DOCUMENT_NAME, EmojiSchema) };
