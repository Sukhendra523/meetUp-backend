const express = require("express");
const {
  requireSignin,
  canWriteMeeting,
  canManageMeeting,
} = require("../common-middleware");
const {
  createMeeting,
  deleteMeeting,
  updateMeeting,
  getMeetingByDateAndEmail,
  getMeetingDetails,
  getAllMeeting,
} = require("../controller/meeting");

const router = express.Router();

const checkMeetingAccess = (req, res, next) =>
  req.body.createdBy !== req.user._id
    ? canManageMeeting(req, res, next)
    : canWriteMeeting(req, res, next);
router.use("/", requireSignin);

router.param("id", checkMeetingAccess);

//create meeting
router.post("/meeting/create", canWriteMeeting, createMeeting);

// getAllMeetings
router.get("/meetings", canManageMeeting, getAllMeeting);

// get Meeting List ByDateAndEmail
router.get(
  "/meeting/:date",
  (req, res, next) =>
    req.body.email !== req.user.email
      ? canManageMeeting(req, res, next)
      : next(),
  getMeetingByDateAndEmail
);

// get Meeting Details
router.get("/meeting/getMeetingDetails/:id", getMeetingDetails);

// delete meeting
router.delete("/meeting/delete/:id", deleteMeeting);

// update Meeting
router.put("/meeting/update/:id", updateMeeting);

module.exports = router;
