const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  meeting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: { type: Date, required: true },
  checkOut: Date,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
