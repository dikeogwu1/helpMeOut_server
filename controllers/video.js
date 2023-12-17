const Video = require("../models/Video");
const { StatusCodes } = require("http-status-codes");

const getAllVideos = async (req, res) => {
  const video = await Video.find({});
  res.status(StatusCodes.OK).json({ video });
};

const saveVideo = async (req, res) => {
  req.body.user = req.user.userId;
  const video = await Video.create(req.body);
  res.status(StatusCodes.CREATED).json("Video saved successfully");
};

const getUserVideos = async (req, res) => {
  const video = await Video.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ video });
};

module.exports = { getAllVideos, saveVideo, getUserVideos };
