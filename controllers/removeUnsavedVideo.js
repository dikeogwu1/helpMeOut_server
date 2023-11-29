const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const deleteVideoFromServer = async (req, res) => {
  const result = await cloudinary.uploader.destroy(req.body.data, {
    resource_type: "video",
  });
  res.status(StatusCodes.OK).json("ok");
};

module.exports = { deleteVideoFromServer };
