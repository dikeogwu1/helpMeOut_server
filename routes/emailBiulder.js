const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const { emailVideo } = require("../controllers/emailBuilder");

router.route("/emailVideo").post(authentication, emailVideo);

module.exports = router;
