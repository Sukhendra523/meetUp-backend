const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const {
  requireSignin,
  canReadUser,
  canWriteUser,
} = require("../common-middleware");
const {
  getUserDetails,
  searchUserEmails,
  updateUser,
  getUserProfile,
  getAllUsers,
  searchUser,
  deleteUser,
} = require("../controller/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(path.dirname(__dirname)), "public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/users", requireSignin, canReadUser, getAllUsers);

router.get(
  "/user/:id",
  requireSignin,
  (req, res, next) =>
    req.params.id !== req.user._id ? canReadUser(req, res, next) : next(),
  getUserDetails
);

router.get(
  "/users/searchEmails/:input",
  requireSignin,
  canReadUser,
  searchUserEmails
);

router.get("/users/search/:input", requireSignin, canReadUser, searchUser);

router.get(
  "/user/profile/:id",
  requireSignin,
  (req, res, next) =>
    req.params.id !== req.user._id ? canReadUser(req, res, next) : next(),
  getUserProfile
);

router.delete(
  "/user/delete/:id",
  requireSignin,
  (req, res, next) =>
    req.params.id !== req.user._id ? canWriteUser(req, res, next) : next(),
  deleteUser
);

router.put(
  "/user/update/:id",
  requireSignin,
  (req, res, next) =>
    req.params.id !== req.user._id ? canWriteUser(req, res, next) : next(),
  upload.single("image"),
  updateUser
);

module.exports = router;
