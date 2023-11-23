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
  // ip: {
  //   type: String,
  //   required: [true, "Please provide tag"],
  //   maxlength: 100,
  // },
  // videoDuration: {
  //   type: Number,
  //   required: [true, "Please provide video duration"],
  //   maxlength: 50,
  // },
});

module.exports = mongoose.model("Video", VideoShema);
