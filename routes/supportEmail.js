const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

const { sendSupportMsg } = require("../controllers/supportEmail");

router.route("/support").post(authentication, sendSupportMsg);

module.exports = router;
