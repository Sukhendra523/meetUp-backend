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

router.post("/meeting/create", canWriteMeeting, createMeeting);
router.get("/meetings", canManageMeeting, getAllMeeting);

router.get(
  "/meeting/:date",
  (req, res, next) =>
    req.body.email !== req.user.email
      ? canManageMeeting(req, res, next)
      : next(),
  getMeetingByDateAndEmail
);

router.get("/meeting/getMeetingDetails/:id", getMeetingDetails);

router.delete("/meeting/delete/:id", deleteMeeting);

router.put("/meeting/update/:id", updateMeeting);

module.exports = router;
