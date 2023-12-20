const Video = require("../models/Video");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const cloudinary = require("cloudinary").v2;

const getAllVideos = async (req, res) => {
  const video = await Video.find({});
  res.status(StatusCodes.OK).json({ video });
};

const saveVideo = async (req, res) => {
  req.body.user = req.user.userId;

  const existingVideo = await Video.findOne({
    publicId: req.body.publicId,
    user: req.user.userId,
  });

  if (existingVideo) {
    const video = await Video.findByIdAndUpdate(
      { _id: existingVideo._id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json("Video saved successfully");
    return;
  }

  const video = await Video.create(req.body);
  res.status(StatusCodes.CREATED).json("Video saved successfully");
};

const getUserVideos = async (req, res) => {
  const video = await Video.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ video });
};

const getSingleVideo = async (req, res) => {
  const { id: videoId } = req.params;
  const video = await Video.findOne({ _id: videoId, user: req.user.userId });
  if (!video) {
    throw NotFoundError(`No video with id : ${videoId}`);
  }
  res.status(StatusCodes.OK).json({ video });
};

const deleteVideo = async (req, res) => {
  const {
    user: { userId },
    params: { id: videoId },
  } = req;

  const existingVideo = await Video.findOne({
    _id: videoId,
    user: userId,
  });

  if (!existingVideo) {
    throw new NotFoundError(`No video with id ${videoId}`);
  }

  cloudinary.uploader.destroy(
    existingVideo.publicId,
    {
      resource_type: "video",
    },
    (error, result) => {
      if (error) {
        throw new CustomAPIError(
          "An error occured while trying to delete video"
        );
      } else {
        console.log("Video deleted from Cloudinary");
      }
    }
  );

  const video = await Video.findByIdAndRemove({
    _id: existingVideo._id,
    userId,
  });

  res.status(StatusCodes.OK).json("Video deleted from server");
};

module.exports = {
  getAllVideos,
  saveVideo,
  getUserVideos,
  getSingleVideo,
  deleteVideo,
};
