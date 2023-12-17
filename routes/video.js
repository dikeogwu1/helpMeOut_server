const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const {
  getAllVideos,
  getUserVideos,
  saveVideo,
} = require("../controllers/video");

router.route("/").get(getAllVideos);
router.route("/saveVideo").post(authentication, saveVideo);
router.route("/userVideos").get(authentication, getUserVideos);

module.exports = router;
