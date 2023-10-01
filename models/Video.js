const mongoose = require("mongoose");

const VideoShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
  },
  video: {
    type: String,
    required: [true, "Please provide image url"],
  },
  ip: {
    type: String,
    required: [true, "Please provide tag"],
    maxlength: 100,
  },
});

module.exports = mongoose.model("Video", VideoShema);
