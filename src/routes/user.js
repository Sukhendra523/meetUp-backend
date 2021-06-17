const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const { requireSignin, isAdmin, isStudent } = require("../common-middleware");
const { getUserProfile } = require("../controller/user");

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

router.get("/user/getUserProfile/:id", requireSignin, getUserProfile);

module.exports = router;
