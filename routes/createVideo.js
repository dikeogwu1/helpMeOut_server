const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { createVideo } = require("../controllers/createVideo");

router.post("/", upload.single("video"), createVideo);

module.exports = router;
