const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const schedule = require("node-schedule");

const deleteVideoFromServer = async (req, res) => {
  // function to delete a video by public_id
  const deleteVideo = (public_id) => {
    cloudinary.uploader.destroy(
      public_id,
      {
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          console.error("Error deleting video:", error);
        } else {
          console.log("Video deleted successfully:", result);
        }
      }
    );
  };

  const id = req.body.data;
  // Schedule the video deletion for 3 minutes from now
  const scheduledTime = new Date(Date.now() + 3 * 60 * 1000);
  schedule.scheduleJob(scheduledTime, () => {
    deleteVideo(id);
  });
  res.status(200).json("video deletion scheduled successfully");
};

module.exports = { deleteVideoFromServer };
