const fs = require("fs");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2;

const createVideo = async (req, res) => {
  const uploadedFile = req.file; // Contains the uploaded file as a Buffer

  // Check if a file was uploaded
  if (!uploadedFile) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No file uploaded" });
  }

  // Process the file (e.g., save to disk, send in API response)

  // Save the file to disk (adjust the path as needed)
  const filePath = `uploads/${uploadedFile.originalname}`;
  fs.writeFileSync(filePath, uploadedFile.buffer);

  // Upload the video to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    use_filename: true,
    resource_type: "video",
    folder: "screenTalk_videos",
  });

  if (result.duration > 300.0) {
    throw new BadRequestError(
      "Sorry, we can't proccess videos that are longer than 5 minutes"
    );
  }

  // Save the video information to DB
  const newVideo = new Video({
    name: req.body.name,
    video: result.secure_url, // Save the file path or URL to the video field
    ip: req.body.ip,
    videoDuration: result.duration,
  });
  await newVideo.save();
  // Send a response to the client
  res
    .status(StatusCodes.CREATED)
    .json({ message: "File uploaded and processed successfully" });
};

module.exports = { createVideo };
