const fs = require("fs");
const path = require("path");
const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const deleteVideoFromServer = async (req, res) => {
  const filePath = path.join(
    __dirname,
    "../public/uploads/" + `${req.body.data}`
  );
  fs.unlinkSync(filePath);

  res.status(StatusCodes.OK).json("ok");
};

module.exports = { deleteVideoFromServer };
