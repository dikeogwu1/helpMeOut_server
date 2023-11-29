const fs = require("fs");
const path = require("path");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2;

const createVideo = async (req, res) => {
  // Check if a file was uploaded
  if (!req.files) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }

  const uploadedFile = req.files.video;

  if (uploadedFile.size > 3000000) {
    throw new BadRequestError(
      "Sorry, we can't proccess videos longer than 3 minutes in length"
    );
  }

  // upload to Cloudinary
  const result = await cloudinary.uploader.upload(uploadedFile.tempFilePath, {
    resource_type: "video",
    use_filename: true,
    folder: "screenTalk_videos",
  });
  fs.unlinkSync(uploadedFile.tempFilePath);

  res.status(StatusCodes.CREATED).json({
    video: result.secure_url,
    duration: result.duration,
    id: result.public_id,
  });
};

module.exports = { createVideo };
