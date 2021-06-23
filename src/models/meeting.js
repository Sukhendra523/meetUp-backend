const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    schedule: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    inviteList: [String],
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    password: String,
    features: [String],
  },
  { timestamps: true }
);

meetingSchema.methods = {
  authenticate: async function (textPassword) {
    return await bcrypt.compare(textPassword, this.password.userPassword);
  },
};

module.exports = mongoose.model("Meeting", meetingSchema);
