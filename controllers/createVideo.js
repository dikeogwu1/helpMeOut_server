const fs = require("fs");
const path = require("path");
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

  // Save the file to upload folder
  const filePath = path.join(
    __dirname,
    "../public/uploads/" + `${uploadedFile.originalname}`
  );
  console.log(filePath);
  // const filePath = `uploads/${uploadedFile.originalname}`;
  fs.writeFileSync(filePath, uploadedFile.buffer);

  // Upload the video to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    use_filename: true,
    resource_type: "video",
    folder: "screenTalk_videos",
  });

  if (result.duration > 200.0) {
    throw new BadRequestError(
      "Sorry, we can't proccess videos that's longer than 3 minutes"
    );
  }
  // Function to delete the video from Cloudinary
  const deleteVideoFromCloudinary = () => {
    cloudinary.uploader.destroy(filePath, (error, result) => {
      if (error) {
        console.error("Error deleting video from Cloudinary:", error);
      } else {
        console.log(
          "Video deleted from Cloudinary. Cloudinary response:",
          result
        );
      }
    });
  };
  // Schedule the deletion after 20 minutes
  const deletionTimeout = 20 * 60 * 1000;
  // setTimeout(deleteVideoFromCloudinary, deletionTimeout);
  res
    .status(StatusCodes.CREATED)
    .json({ video: result.secure_url, duration: result.duration });
};

module.exports = { createVideo };
