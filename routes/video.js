const express = require("express");
const router = express.Router();

const { getAllVideo } = require("../controllers/video");

router.route("/").get(getAllVideo);

module.exports = router;
