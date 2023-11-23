const { BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const cron = require("node-cron");
// In-memory cache to track scheduled deletions
const scheduledDeletions = new Map();

const deleteVideoFromServer = async (req, res) => {
  // Send "ok" response immediately
  res.status(200).json("ok");

  // Generate a unique request token for tracking
  const requestToken = `${Date.now()}_${Math.random()}`;

  // Schedule the deletion using node-cron (every 30 minutes)
  const cronJob = cron.schedule(
    "0 */1 * * *",
    async () => {
      try {
        // Delete the video
        const publicId = req.body.data;
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "video",
        });
        console.log("Video deleted:", result);
      } catch (error) {
        console.error("Error deleting video:", error);
      } finally {
        // Remove the request token and stop the cron job after deletion
        scheduledDeletions.delete(requestToken);
        cronJob.stop();
      }
    },
    {
      scheduled: false, // Start the job immediately
      timezone: "UTC",
    }
  );

  // Start the cron job
  cronJob.start();
  scheduledDeletions.set(requestToken, cronJob);
};

module.exports = { deleteVideoFromServer };
