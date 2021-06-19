const express = require("express");

const {
  signup,
  signin,
  forgetPassword,
  resetPassword,
  facebookSignin,
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
router.post("/facebookLogin", facebookSignin);

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
