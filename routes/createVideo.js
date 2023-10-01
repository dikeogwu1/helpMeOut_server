const express = require("express");
const router = express.Router();

const { createVideo } = require("../controllers/createVideo");

router.route("/").post(createVideo);

module.exports = router;
