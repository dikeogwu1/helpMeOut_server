const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Video = require("../models/Video");

const createVideo = async (req, res) => {
  const { name, video, ip } = req.body;

  if (!name || !video || !ip) {
    throw new BadRequestError("please provide: name, video and ip");
  }
  const newVideo = await Video.create({ ...req.body });
  res.status(StatusCodes.OK).json({ success: true, data: newVideo.video });
};

module.exports = { createVideo };
