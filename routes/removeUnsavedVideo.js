const express = require("express");
const router = express.Router();

const { deleteVideoFromServer } = require("../controllers/removeUnsavedVideo");

router.route("/").post(deleteVideoFromServer);

module.exports = router;
