const Attendance = require("../models/attendance");

exports.addCheckInTime = async (req, res) => {
  try {
    const attendance = await Attendance.create({
      meeting: req.params.meetingId,
      user: req.body.userId,
      checkIn: new Date(),
    });
    if (attendance) {
      res.status(201).json({
        status: 201,
        success: true,
        message: "user checkIn saved",
        attendance,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.addCheckOutTime = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.attendanceId,
      {
        $set: {
          checkOut: new Date(),
        },
      }
    );
    if (attendance) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "user checkout successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};

exports.getAttendenceData = async (req, res) => {
  try {
    const attendances = await Attendance.find({
      meeting: req.params.meetingId,
    }).populate("user", "_id fullName lastName username email contact image");
    if (attendances) {
      res
        .status(200)
        .json({ status: 200, success: true, attendances: attendances });
    } else {
      res
        .status(400)
        .json({ status: 400, success: false, message: "No attendance Found" });
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      error: error.message,
      message: "Somthing goes wrong !! tyr again later",
    });
  }
};
