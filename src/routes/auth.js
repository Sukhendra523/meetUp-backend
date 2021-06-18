const express = require("express");
const passport = require("passport");

const {
  signup,
  signin,
  forgetPassword,
  resetPassword,
} = require("../controller/auth");
const {
  validateSignupRequest,
  validateSigninRequest,
  validateForgetRequest,
  validateResetPasswordRequest,
  isRequestValidated,
} = require("../vailidators/auth");

const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/auth/facebook/",
    failureRedirect: "/api/auth/facebook/fail",
  })
);

router.get("/auth/facebook/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/auth/facebook/", (req, res) => {
  res.send("Success");
});

router.get(
  "/forget",
  validateForgetRequest,
  isRequestValidated,
  forgetPassword
);

router.post(
  "/reset-password",
  validateResetPasswordRequest,
  isRequestValidated,
  resetPassword
);

module.exports = router;
