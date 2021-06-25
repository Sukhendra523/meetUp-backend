const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const {
  requireSignin,
  canWriteMeeting,
  canManageMeeting,
  canHostMeeting,
} = require("../common-middleware");

const {
  createMeeting,
  deleteMeeting,
  updateMeeting,
  getMeetingByDateAndEmail,
  getMeetingDetails,
  getAllMeeting,
  uploadMeetingDocuments,
  updateMeetingFeatures,
} = require("../controller/meeting");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(path.dirname(path.dirname(__dirname)), "public/documents")
    );
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

// update meeting Features
router.put("/meeting/update/:id", updateMeetingFeatures);

// uplaod Document
router.post(
  "/meeting/document/upload/:mid",
  upload.single("document"),
  uploadMeetingDocuments
);

module.exports = router;
