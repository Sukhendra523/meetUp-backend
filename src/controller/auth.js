const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const Token = require("../models/token");
const moment = require("moment");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const emailExits = await User.findOne({ email: email }, "email");
    const usernameExits = await User.findOne(
      { username: username },
      "username"
    );

    if (emailExits || usernameExits) {
      return res.status(400).json({
        message:
          "This " +
          (emailExits
            ? `email ${emailExits.email}`
            : `username ${usernameExits.username}`) +
          " already Exists",
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        username,
        password: hashPassword,
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        res
          .status(201)
          .json({ message: `user Signup Successfully`, savedUser });
      } else {
        res.status(400).json({
          message: "Can not save please try again",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.signin = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).populate("role", "_id name");

    if (user) {
      if (user.authenticate(password)) {
        const token = jwt.sign(
          { _id: user._id, role: user.role.name },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(200).json({ token, user: user });
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      return res.status(400).json({ message: "Invalid ID" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

exports.forgetPassword = (req, res) => {
  User.findOne({ email: req.query.email }, (error, user) => {
    if (error) return res.status(400).json(error);
    if (!user) {
      return res
        .status(400)
        .json({ message: "No user found with that email address." });
    }
    Token.findOne({ userId: user._id }, (error, token) => {
      if (error) return res.status(400).json(error);
      if (token) token.deleteOne();
      let resetToken = crypto.randomBytes(32).toString("hex"); //creating the token to be sent to the forgot password form (react)
      bcrypt.hash(resetToken, 10, (error, hash) => {
        Token.create({
          userId: user._id,
          token: hash,
          expire: moment.utc().add(3600, "seconds"),
        }).then(function (item) {
          if (!item)
            return throwFailed(
              res,
              "Oops problem in creating new password record"
            );

          var smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "contact.sukhendra@gmail.com",
              pass: "think523",
            },
          });
          let mailOptions = {
            from: '"<Sukhendra Rajawat>" contact.sukhendra@gmail.com',
            to: user.email,
            subject: "Reset your account password",
            html:
              "<h4><b>Reset Password</b></h4>" +
              "<p>To reset your password, click here:</p>" +
              "<a href=" +
              process.env.ClIENT_URL +
              "reset/" +
              user._id +
              "/" +
              token +
              '">' +
              process.env.ClIENT_URL +
              "reset/" +
              user._id +
              "/" +
              token +
              "</a>" +
              "<br><br>" +
              "<p>--Team</p>",
          };
          let mailSent = smtpTransport.sendMail(mailOptions); //sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
          if (mailSent) {
            return res.status(200).json({
              success: true,
              message: "Check your mail to reset your password.",
            });
          } else {
            return throwFailed(error, "Unable to send email.");
          }
        });
      });
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { userId, token, password } = req.body;
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  await User.updateOne(
    { _id: userId },
    { $set: { password: password } },
    { new: true }
  );

  const user = await User.findById({ _id: userId });

  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "SendGrid",
    auth: {
      user: "sukhendra523",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  let mailOptions = {
    from: '"<Sukhendra Rajawat>" 523sukh@gmail.com',
    to: user.email,
    subject: "Password has Changed",
    html: "<h4><b>Password has Changed successfully</b></h4>",
  };

  let mailSent = smtpTransport.sendMail(mailOptions); //sending mail to the user where he can reset password.User id and the token generated are sent as params in a link
  if (mailSent) {
    return res.json({
      success: true,
      message: "Password has Changed successfully",
    });
  } else {
    return throwFailed(error, "Unable to send email.");
  }
  await passwordResetToken.deleteOne();
};