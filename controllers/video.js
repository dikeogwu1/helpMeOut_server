const Video = require("../models/Video");
const { StatusCodes } = require("http-status-codes");

const getAllVideo = async (req, res) => {
  const video = await Video.find({});
  res.status(StatusCodes.OK).json({ video });
};

module.exports = { getAllVideo };
