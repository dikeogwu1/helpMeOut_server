const mongoose = require("mongoose");

const VideoShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      maxlength: 40,
    },
    videoUrl: {
      type: String,
      required: [true, "Please provide video url"],
    },
    publicId: {
      type: String,
      required: [true, "Please video's public id"],
    },
    videoDuration: {
      type: Number,
      required: [true, "Please provide video duration"],
      maxlength: 10,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoShema);
