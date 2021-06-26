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
  createUser,
  updateUserProfile,
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

router.use("/", requireSignin);

router.post("/user/create", canWriteUser, createUser);
router.get("/users", canReadUser, getAllUsers);

router.get(
  "/users/searchEmails/:query",

  canReadUser,
  searchUserEmails
);

router.get("/users/search/:query", canReadUser, searchUser);

router.get(
  "/user/profile/:id",

  (req, res, next) =>
    req.params.id !== req.user._id ? canReadUser(req, res, next) : next(),
  getUserProfile
);

router.delete(
  "/user/delete/:id",

  (req, res, next) =>
    req.params.id !== req.user._id ? canWriteUser(req, res, next) : next(),
  deleteUser
);

router.put(
  "/user/update/:id",

  (req, res, next) =>
    req.params.id !== req.user._id ? canWriteUser(req, res, next) : next(),
  updateUser
);

router.put(
  "/user/updateProfile/:id",

  (req, res, next) =>
    req.params.id !== req.user._id ? canWriteUser(req, res, next) : next(),
  upload.single("image"),
  updateUserProfile
);

router.get(
  "/user/getUserDetails/:id",
  (req, res, next) =>
    req.params.id !== req.user._id ? canReadUser(req, res, next) : next(),
  getUserDetails
);

module.exports = router;
