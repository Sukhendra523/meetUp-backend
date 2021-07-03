const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.validateSigninRequest = [
  // check("email").isEmail().withMessage("Valid email is required") ,
  //   check("username").notEmpty().withMessage("Username is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(403).json({
      message: errors.array()[0].msg,
    });
  }
  next();
};

exports.validateResetPasswordRequest = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long"),
];

exports.validateForgetRequest = [
  check("email").isEmail().withMessage("Valid email is required"),
];
