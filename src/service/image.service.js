"use strict";
const { InternalServerError } = require("../core/error.response");
const cloudinary = require("../db/init.cloudinary");

class ImageService {
  static async uploadImage(image) {
    try {
      const { secure_url } = await cloudinary.uploader.upload(image);
      if (!secure_url) {
        throw new InternalServerError("Unable to upload image");
      }
      return secure_url;
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
module.exports = ImageService;
