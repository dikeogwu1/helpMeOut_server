const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  getAllVideos,
  getUserVideos,
  saveVideo,
  getSingleVideo,
  deleteVideo,
} = require("../controllers/video");

router.route("/").get(getAllVideos);
router.route("/saveVideo").post(authentication, saveVideo);
router.route("/userVideos").get(authentication, getUserVideos);
router.route("/:id").delete(authentication, deleteVideo);
router.route("/:id").get(authentication, getSingleVideo);

module.exports = router;
