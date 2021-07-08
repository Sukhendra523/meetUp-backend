const express = require("express");
const { requireSignin, canWriteMeeting } = require("../common-middleware");
const {
  addCheckInTime,
  addCheckOutTime,
  getAttendenceData,
} = require("../controller/attendance");

const router = express.Router();

router.post("/attendance/checkIn/:meetingId", requireSignin, addCheckInTime);

router.put(
  "/attendance/checkOut/:attendanceId",
  requireSignin,
  addCheckOutTime
);

router.get(
  "/attendance/view/:meetingId",
  requireSignin,
  canWriteMeeting,
  getAttendenceData
);

module.exports = router;
