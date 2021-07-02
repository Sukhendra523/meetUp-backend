const express = require("express");

const {
  signup,
  signin,
  forgetPassword,
  resetPassword,
  facebookSignin,
  activateAccount,
  registerAccount,
  forgetPasswordMobile,
  resetPasswordMobile,
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
router.post("/auth/activate", activateAccount);
router.post("/register", registerAccount);
router.post(
  "/forget-password",
  validateForgetRequest,
  isRequestValidated,
  forgetPassword
);

router.post(
  "/m-forget-password",
  validateForgetRequest,
  isRequestValidated,
  forgetPasswordMobile
);

router.post(
  "/reset-password",
  validateResetPasswordRequest,
  isRequestValidated,
  resetPassword
);
router.post(
  "/m-reset-password",
  validateResetPasswordRequest,
  isRequestValidated,
  resetPasswordMobile
);

module.exports = router;
